"""The LOCAL part of Chapter 7 (course `pipelines`). Everything about declarative pipelines themselves —
streaming tables, materialized views, expectations, AUTO CDC, refresh modes, the event log — is DOCUMENTED,
NOT RUN: it needs a Databricks workspace. What this script can check, on local PySpark 4.0.1 + Delta 4.0.0:

  1. the ARITHMETIC of the three documented expectation policies (warn / drop / fail) over the Chapter 5
     bronze events — what each policy would keep, drop or reject. This is plain Spark computing the
     documented semantics; it is not output from a pipeline engine.
  2. what a Spark streaming read of a Delta table does when someone UPDATEs the source: the stream fails
     unless `skipChangeCommits` is set — the reason streaming tables assume append-only sources.

Writes under ./.verify-warehouse-ch07 (git-ignored).
"""
import os
import shutil

from delta import configure_spark_with_delta_pip
from pyspark.sql import SparkSession, functions as F

ROOT = os.path.abspath(".verify-warehouse-ch07")
shutil.rmtree(ROOT, ignore_errors=True)
os.makedirs(ROOT)
builder = (
    SparkSession.builder.master("local[2]").appName("ch07")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .config("spark.sql.warehouse.dir", os.path.join(ROOT, "wh"))
    .config("spark.ui.enabled", "false")
    .config("spark.sql.shuffle.partitions", "2")
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()
spark.sparkContext.setLogLevel("ERROR")
sql = spark.sql

# ---- the Chapter 5 bronze events (11 text rows) -------------------------------------------------------------
EVENTS = [
    ("o1", "7", "40.00", "COMPLETED"), ("o2", "7", "25.00", "COMPLETED"), ("o3", "9", "60.00", "CANCELLED"),
    ("o4", "9", "15.00", "COMPLETED"), ("o5", "12", "80.00", "COMPLETED"), ("o6", "7", "10.00", "PENDING"),
    ("o4", "9", "15.00", "COMPLETED"), ("o7", "9", "n/a", "COMPLETED"), ("o6", "7", "10.00", "COMPLETED"),
    ("o8", "12", "-5.00", "PENDING"), ("o9", "15", "22.00", "COMPLETED"),
]
spark.createDataFrame(EVENTS, "order_id string, store_id string, amount string, status string").createOrReplaceTempView("raw")
sql("""CREATE OR REPLACE TEMP VIEW typed AS
       SELECT order_id, CAST(store_id AS INT) store_id, try_cast(amount AS DECIMAL(10,2)) amount, status FROM raw""")

# ---- 1. expectation policies: the arithmetic -----------------------------------------------------------------
EXPECTATIONS = {
    "amount_present": "amount IS NOT NULL",
    "amount_positive": "amount > 0",
    "store_known": "store_id IN (7, 9, 12)",
}
passed = {name: sql(f"SELECT count(*) c FROM typed WHERE coalesce(({cond}), false)").collect()[0].c for name, cond in EXPECTATIONS.items()}
failed = {name: 11 - p for name, p in passed.items()}
assert passed == {"amount_present": 10, "amount_positive": 9, "store_known": 10}, passed
assert failed == {"amount_present": 1, "amount_positive": 2, "store_known": 1}, failed  # a NULL amount is not "> 0"
violators = {r.order_id for r in sql(
    "SELECT order_id FROM typed WHERE NOT (" + " AND ".join(f"coalesce(({c}), false)" for c in EXPECTATIONS.values()) + ")").collect()}
assert violators == {"o7", "o8", "o9"}
warn_kept = 11  # warn (the default) keeps every row and only records the pass/fail counts
drop_kept = sql("SELECT count(*) c FROM typed WHERE " + " AND ".join(f"coalesce(({c}), false)" for c in EXPECTATIONS.values())).collect()[0].c
assert (warn_kept, drop_kept, warn_kept - drop_kept) == (11, 8, 3)
# fail: the first violation stops the update and the whole write is rolled back, so nothing is kept (documented).

# ---- 2. a Delta streaming read and an updated source ---------------------------------------------------------
SRC, SINK, CKPT = (os.path.join(ROOT, n) for n in ("src", "sink", "ckpt"))
spark.createDataFrame([("o1", "PENDING"), ("o2", "PENDING"), ("o3", "PENDING")], "order_id string, status string") \
    .write.format("delta").save(SRC)


def stream_once(**options):
    reader = spark.readStream.format("delta")
    for k, v in options.items():
        reader = reader.option(k, v)
    q = reader.load(SRC).writeStream.format("delta").option("checkpointLocation", CKPT).trigger(availableNow=True).start(SINK)
    try:
        q.awaitTermination()
        return "ok"
    except Exception as e:  # noqa: BLE001
        return str(e).replace("\n", " ")


sink_count = lambda: spark.read.format("delta").load(SINK).count()  # noqa: E731
assert stream_once() == "ok" and sink_count() == 3
sql(f"UPDATE delta.`{SRC}` SET status = 'COMPLETED' WHERE order_id = 'o1'")  # the source changes an existing row
msg = stream_once()
assert msg != "ok" and "skipChangeCommits" in msg, msg[:300]  # the stream refuses an update it cannot append
assert stream_once(skipChangeCommits="true") == "ok"  # told to skip such commits, it moves on...
assert sink_count() == 3  # ...and the updated row never reaches the sink
spark.createDataFrame([("o4", "PENDING")], "order_id string, status string").write.format("delta").mode("append").save(SRC)
assert stream_once(skipChangeCommits="true") == "ok" and sink_count() == 4  # appends still flow

print("OK: Chapter 7 local facts reproduced (policy arithmetic and the Delta source rule; pipelines themselves are documented, not run)")
