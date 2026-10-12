"""Reproduces and asserts the local outputs quoted in Chapter 4 (course `ingestion`).

Local PySpark 4.0.1 + Delta Lake 4.0.0 on local[2] — NOT Databricks. Auto Loader (`cloudFiles`), COPY INTO,
`_rescued_data`, managed connectors and Lakeflow Connect are Databricks features and are NOT run here. What
IS run is Spark's own file stream source with a checkpoint (the closest local analogue for progress
tracking, restarts and replay), plain batch loads, PERMISSIVE parsing, and JSON schema inference.

Writes under ./.verify-warehouse-ch04 (git-ignored).
"""
import json
import os
import shutil
from decimal import Decimal

from delta import configure_spark_with_delta_pip
from pyspark.sql import SparkSession, functions as F

ROOT = os.path.abspath(".verify-warehouse-ch04")
shutil.rmtree(ROOT, ignore_errors=True)
os.makedirs(ROOT)
builder = (
    SparkSession.builder.master("local[2]").appName("ch04")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .config("spark.sql.warehouse.dir", os.path.join(ROOT, "wh"))
    .config("spark.ui.enabled", "false")
    .config("spark.sql.shuffle.partitions", "2")
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()
spark.sparkContext.setLogLevel("ERROR")

LAND = os.path.join(ROOT, "landing")
os.makedirs(LAND)
FILES = {
    "orders-a.csv": ["o1,7,40.00,COMPLETED", "o2,7,25.00,COMPLETED", "o3,9,60.00,CANCELLED"],
    "orders-b.csv": ["o4,9,15.00,COMPLETED", "o5,12,80.00,COMPLETED", "o6,7,10.00,PENDING"],
    "orders-c.csv": ["o4,9,15.00,COMPLETED", "o7,9,n/a,COMPLETED"],  # a resent o4, and an unreadable amount
}


def land(name):
    with open(os.path.join(LAND, name), "w") as f:
        f.write("order_id,store_id,amount,status\n" + "\n".join(FILES[name]) + "\n")


TEXT = "order_id string, store_id string, amount string, status string"

# ---- §4.2 a batch load is only as repeat-safe as you make it -------------------------------------------
for n in FILES:
    land(n)
batch = spark.read.option("header", True).schema(TEXT).csv(LAND)
assert batch.count() == 8
batch.write.format("delta").mode("append").save(os.path.join(ROOT, "bronze_batch"))
batch.write.format("delta").mode("append").save(os.path.join(ROOT, "bronze_batch"))  # the same load, run again
assert spark.read.format("delta").load(os.path.join(ROOT, "bronze_batch")).count() == 16
shutil.rmtree(LAND)
os.makedirs(LAND)

# ---- §4.3 / §4.4 an incremental file stream with a checkpoint -------------------------------------------
BRONZE = os.path.join(ROOT, "bronze_stream")
CKPT = os.path.join(ROOT, "_checkpoint")


def run_once():
    q = (spark.readStream.option("header", True).schema(TEXT).csv(LAND)
         .select("*", F.col("_metadata.file_name").alias("source_file"))
         .writeStream.format("delta").option("checkpointLocation", CKPT)
         .trigger(availableNow=True).start(BRONZE))
    q.awaitTermination()
    return spark.read.format("delta").load(BRONZE).count()


def files_in_bronze():
    return sorted(r.source_file for r in spark.read.format("delta").load(BRONZE).select("source_file").distinct().collect())


timeline = []
land("orders-a.csv"); timeline.append(run_once())
land("orders-b.csv"); timeline.append(run_once())
timeline.append(run_once())  # nothing new arrived
land("orders-c.csv"); timeline.append(run_once())
assert timeline == [3, 6, 6, 8], timeline
assert files_in_bronze() == ["orders-a.csv", "orders-b.csv", "orders-c.csv"]
ckpt_entries = sorted(os.listdir(CKPT))
assert {"commits", "offsets", "metadata"} <= set(ckpt_entries), ckpt_entries
with open(os.path.join(CKPT, "metadata")) as f:
    assert "id" in json.load(f)  # the query's identity lives in the checkpoint
shutil.rmtree(CKPT)  # losing the checkpoint loses the memory of what was read
assert run_once() == 16  # every file read again, into the same table

# ---- §4.6 malformed records: parse permissively, keep the raw line -------------------------------------
typed = "order_id string, store_id int, amount decimal(10,2), status string, _bad_record string"
parsed = (spark.read.option("header", True).option("mode", "PERMISSIVE").option("columnNameOfCorruptRecord", "_bad_record")
          .schema(typed).csv(LAND).cache())
parsed.count()  # materialise: Spark forbids querying only the corrupt column of an uncached read
bad = [(r.order_id, r.amount, r._bad_record) for r in parsed.filter("_bad_record IS NOT NULL").collect()]
assert bad == [("o7", None, "o7,9,n/a,COMPLETED")], bad
good = parsed.filter("_bad_record IS NULL")
assert good.count() == 7 and parsed.count() == 8
assert 8 == good.count() + parsed.filter("_bad_record IS NOT NULL").count()  # reconciles

# ---- §4.5 schema drift: a fixed schema drops what it does not know; inference widens types --------------
DRIFT = os.path.join(ROOT, "drift")
os.makedirs(DRIFT)
with open(os.path.join(DRIFT, "1.json"), "w") as f:
    f.write('{"order_id":"o1","store_id":7,"amount":40.00,"status":"COMPLETED"}\n')
with open(os.path.join(DRIFT, "2.json"), "w") as f:
    f.write('{"order_id":"o8","store_id":12,"amount":"12,50","status":"PENDING","channel":"web"}\n')
fixed = spark.read.schema("order_id string, store_id int, amount decimal(10,2), status string, _bad_record string") \
    .option("columnNameOfCorruptRecord", "_bad_record").json(DRIFT).cache()
fixed.count()
assert "channel" not in fixed.columns  # the new field is silently not there
o8 = fixed.filter("order_id = 'o8'").collect()[0]
# The string "12,50" (a decimal comma) was parsed as 1250.00 with NO bad-record flag: silent corruption.
assert o8.amount == Decimal("1250.00") and o8._bad_record is None
inferred = spark.read.json(DRIFT)
assert dict(inferred.dtypes) == {"amount": "string", "channel": "string", "order_id": "string", "status": "string", "store_id": "bigint"}, inferred.dtypes
only_first = spark.read.json(os.path.join(DRIFT, "1.json"))
assert dict(only_first.dtypes)["amount"] == "double"  # the same column was a number before the odd file arrived

# ---- §4.9 duplicates and counts: source -> bronze -------------------------------------------------------
bronze = spark.read.format("delta").load(os.path.join(ROOT, "bronze_batch"))
assert bronze.count() == 16 and bronze.select("order_id").distinct().count() == 7
text_rows = spark.read.option("header", True).schema(TEXT).csv(LAND)
assert text_rows.count() == 8 and text_rows.select("order_id").distinct().count() == 7
per_file = {r.source_file: r["count"] for r in
            spark.read.format("delta").load(BRONZE).dropDuplicates(["order_id", "store_id", "amount", "status", "source_file"])
            .groupBy("source_file").count().collect()}
assert per_file == {"orders-a.csv": 3, "orders-b.csv": 3, "orders-c.csv": 2}, per_file

print("OK: Chapter 4 local facts reproduced (Spark file stream, not Auto Loader; Databricks features are documented, not run)")
