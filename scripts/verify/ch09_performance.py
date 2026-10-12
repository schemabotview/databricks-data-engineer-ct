"""Reproduces and asserts every measurement quoted in Chapter 9 (course `performance`).

Local PySpark 4.0.1 + Delta Lake 4.0.0 on local[2] — NOT a Databricks Runtime. Photon, serverless sizing,
predictive optimisation and the platform's own cost model are NOT run and are documented only. Nothing here
asserts a TIMING: timings vary run to run, so the course quotes only exact counts — files read after data
skipping, rows per partition, tasks per stage, plan operators, row counts and checksums.

Data: one million generated orders (hash-based, no random()). OPTIMIZE's target file size is lowered to
400 KB so a one-million-row demo produces several files, as a large table would. Takes a few minutes.
Writes under ./.verify-warehouse-ch09 (git-ignored).
"""
import json
import os
import re
import shutil
import time
import urllib.request
from decimal import Decimal

from delta import configure_spark_with_delta_pip
from pyspark.sql import SparkSession, functions as F

ROOT = os.path.abspath(".verify-warehouse-ch09")
shutil.rmtree(ROOT, ignore_errors=True)
os.makedirs(ROOT)
builder = (
    SparkSession.builder.master("local[2]").appName("ch09")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .config("spark.sql.warehouse.dir", os.path.join(ROOT, "wh"))
    .config("spark.ui.enabled", "true").config("spark.ui.port", "4059")  # the REST API serves the stage metrics
    .config("spark.sql.shuffle.partitions", "4")
    .config("spark.sql.adaptive.enabled", "false")  # fixed plans, so operator names and task counts are stable
    .config("spark.databricks.delta.optimize.maxFileSize", "400000")
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()
spark.sparkContext.setLogLevel("ERROR")
sql = spark.sql
N = 1_000_000


def h(buckets, salt):
    return F.pmod(F.hash(F.col("order_id"), F.lit(salt)), F.lit(buckets))


def generate():
    return spark.range(N).select(F.col("id").alias("order_id")).select(
        "order_id",
        (h(50, 1) + 1).cast("int").alias("store_id"),
        F.date_add(F.lit("2026-09-01").cast("date"), h(30, 2).cast("int")).alias("order_date"),
        (h(100, 3) + 1).cast("decimal(10,2)").alias("amount"),
        F.when(h(10, 4) < 8, "COMPLETED").otherwise("PENDING").alias("status"),
        h(1000, 5).cast("int").alias("customer_id"),
    )


def spread(df, files):
    """Write `df` as roughly `files` files, each holding rows of every store (so nothing is clustered)."""
    return df.withColumn("fk", h(files, 9)).repartition(files, "fk").drop("fk")


def files_read(df):
    """Run `df`, then read the scan's `numFiles` metric: how many files were opened after skipping/pruning."""
    df.collect()
    leaves = df._jdf.queryExecution().executedPlan().collectLeaves()
    found = [int(leaves.apply(i).metrics().apply("numFiles").value()) for i in range(leaves.size()) if leaves.apply(i).metrics().contains("numFiles")]
    assert len(found) == 1, found
    return found[0]


def detail(path_or_table, path=True):
    ref = f"delta.`{path_or_table}`" if path else path_or_table
    return sql(f"DESCRIBE DETAIL {ref}").collect()[0]


def rest(path):
    return json.load(urllib.request.urlopen(f"{spark.sparkContext.uiWebUrl}/api/v1/applications/{spark.sparkContext.applicationId}/{path}"))


def last_job_tasks():
    time.sleep(2)
    job = sorted(rest("jobs"), key=lambda j: j["jobId"])[-1]
    stages = sorted((s for s in rest("stages") if s["stageId"] in job["stageIds"]), key=lambda s: s["stageId"])
    return [s["numTasks"] for s in stages]


# ---- §9.6 layouts, and §9.1 the correctness baseline -----------------------------------------------------------
P = lambda name: os.path.join(ROOT, name)  # noqa: E731
spread(generate(), 40).write.format("delta").save(P("flat"))
filter7 = lambda p: spark.read.format("delta").load(p).filter("store_id = 7")  # noqa: E731
assert detail(P("flat")).numFiles == 24 and files_read(filter7(P("flat"))) == 24  # no layout, no skipping

sql(f"CREATE TABLE zt USING delta LOCATION '{P('zt')}' AS SELECT * FROM delta.`{P('flat')}`")
sql("OPTIMIZE zt")  # compaction alone
assert detail("zt", path=False).numFiles == 2 and files_read(spark.table("zt").filter("store_id = 7")) == 2
sql("OPTIMIZE zt ZORDER BY (store_id)")
assert detail("zt", path=False).numFiles == 19 and files_read(spark.table("zt").filter("store_id = 7")) == 1
assert files_read(spark.table("zt").filter("customer_id = 5")) == 19  # a layout helps the columns it was built for

sql(f"""CREATE TABLE lc (order_id BIGINT, store_id INT, order_date DATE, amount DECIMAL(10,2), status STRING, customer_id INT)
        USING delta CLUSTER BY (store_id) LOCATION '{P('lc')}'""")
sql(f"INSERT INTO lc SELECT * FROM delta.`{P('flat')}`")
sql("OPTIMIZE lc")
assert detail("lc", path=False).numFiles == 19 and list(detail("lc", path=False).clusteringColumns) == ["store_id"]
assert files_read(spark.table("lc").filter("store_id = 7")) == 1
assert files_read(spark.table("lc").filter("customer_id = 5")) == 19

spread(generate(), 40).write.format("delta").partitionBy("order_date").save(P("pd"))
assert detail(P("pd")).numFiles == 720  # 24 write tasks x 30 partitions: partitioning an unsorted write multiplies files
assert files_read(spark.read.format("delta").load(P("pd")).filter("order_date = '2026-09-03'")) == 24  # only that one partition
assert files_read(filter7(P("pd"))) == 720  # a filter on any other column still opens everything
generate().write.format("delta").partitionBy("customer_id").save(P("pc"))
assert detail(P("pc")).numFiles == 2000  # 1,000 partitions x 2 tasks: partitioning by a high-cardinality column

# correctness baseline: every layout holds exactly the same data
for name in ("flat", "zt", "lc", "pd", "pc"):
    c, s = spark.read.format("delta").load(P(name)).agg(F.count("*"), F.sum("amount")).collect()[0]
    assert (c, s) == (1_000_000, Decimal("50497436.00")), (name, c, s)

# ---- §9.5 small files ---------------------------------------------------------------------------------------------
spread(generate(), 200).write.format("delta").save(P("small"))
assert detail(P("small")).numFiles == 128 and files_read(filter7(P("small"))) == 128
sql(f"OPTIMIZE delta.`{P('small')}`")
assert detail(P("small")).numFiles == 25
assert spark.read.format("delta").load(P("small")).agg(F.count("*")).collect()[0][0] == 1_000_000

# ---- §9.4 join strategies, shuffles and skew -----------------------------------------------------------------------
orders = generate().select("order_id", "store_id", "amount")
stores = spark.range(1, 51).select(F.col("id").cast("int").alias("store_id"), F.concat(F.lit("store-"), F.col("id")).alias("name"))


def operators(df):
    plan = df._jdf.queryExecution().executedPlan().toString()
    return [re.sub(r"\(.*|\s*\[.*", "", re.sub(r"^[\s:+\-*0-9()|]*", "", line)) for line in plan.split("\n") if line.strip()]


def joined():
    return orders.join(stores, "store_id").groupBy("name").agg(F.sum("amount").alias("s"))


default_ops = operators(joined())
assert "BroadcastHashJoin" in default_ops and default_ops.count("Exchange hashpartitioning") == 1  # only the GROUP BY shuffles
default_rows = sorted(map(tuple, joined().collect()))
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "-1")
smj_ops = operators(joined())
assert "SortMergeJoin" in smj_ops and smj_ops.count("Exchange hashpartitioning") == 3  # both join sides, then the GROUP BY
assert sorted(map(tuple, joined().collect())) == default_rows  # same answer, very different data movement
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "10485760")
assert operators(orders.join(F.broadcast(stores), "store_id").groupBy("name").agg(F.sum("amount"))).count("Exchange hashpartitioning") == 1

skewed = orders.withColumn("store_id", F.when(h(10, 7) < 8, F.lit(7)).otherwise(F.col("store_id")))
share = skewed.filter("store_id = 7").count() / N
assert 0.80 < share < 0.81, share


def rows_per_partition(df, cols):
    parts = df.repartition(4, *cols).withColumn("p", F.spark_partition_id()).groupBy("p").count().collect()
    return sorted((r["count"] for r in parts), reverse=True)


assert rows_per_partition(skewed, [F.col("store_id")]) == [855480, 64525, 43880, 36115]
assert rows_per_partition(orders, [F.col("store_id")]) == [319925, 279702, 219981, 180392]
assert rows_per_partition(skewed.withColumn("salt", h(64, 11)), [F.col("store_id"), F.col("salt")]) == [299626, 285408, 241143, 173823]

# ---- §9.2 the Spark UI's numbers, from its REST API --------------------------------------------------------------------
skewed.repartition(4, "store_id").write.format("noop").mode("overwrite").save()
time.sleep(2)
shuffle_stage = max((s for s in rest("stages") if s["numTasks"] == 4 and s["shuffleReadRecords"] == 1_000_000), key=lambda s: s["stageId"])
quantiles = rest(f"stages/{shuffle_stage['stageId']}/0/taskSummary?quantiles=0.0,0.25,0.5,0.75,1.0")["shuffleReadMetrics"]["readRecords"]
assert quantiles == [36115.0, 43880.0, 64525.0, 855480.0, 855480.0], quantiles  # one task read 13x the median

# ---- §9.3 parallelism should match the data ----------------------------------------------------------------------------
tiny = spark.range(1000).select((F.col("id") % 50).cast("int").alias("store_id"), F.col("id").alias("amount"))
agg = lambda: tiny.groupBy("store_id").agg(F.sum("amount")).write.format("noop").mode("overwrite").save()  # noqa: E731
spark.conf.set("spark.sql.shuffle.partitions", "200")
agg()
assert last_job_tasks()[-1] == 200  # 200 tasks to aggregate 1,000 rows
spark.conf.set("spark.sql.shuffle.partitions", "4")
agg()
assert last_job_tasks()[-1] == 4
spark.conf.set("spark.sql.shuffle.partitions", "200")
spark.conf.set("spark.sql.adaptive.enabled", "true")
agg()
assert last_job_tasks()[-1] == 1  # adaptive execution coalesced the 200 small partitions into 1 task

# ---- §9.8 HYPOTHETICAL cost arithmetic (every input below is an ASSUMPTION, not a measurement or a price) -------
SECONDS_PER_FILE, MACHINES, RATE_UNITS_PER_MACHINE_HOUR, RUNS_PER_DAY = 3, 2, 1, 24


def units_per_day(files):
    machine_hours = files * SECONDS_PER_FILE * MACHINES / 3600
    return round(machine_hours * RATE_UNITS_PER_MACHINE_HOUR * RUNS_PER_DAY, 2)


# files read by the same store filter, MEASURED above: flat 24, compaction only 2, clustered 1, date-partitioned 720
assert [units_per_day(f) for f in (24, 2, 1, 720)] == [0.96, 0.08, 0.04, 28.8]

print("OK: Chapter 9 measurements reproduced (local PySpark 4.0.1 + Delta 4.0.0; counts only, no timings; Photon/serverless/predictive optimisation not run)")
