"""Reproduces and asserts every output quoted in Chapter 5 (course `transformations`).

Local PySpark 4.0.1 + Delta Lake 4.0.0 on local[2] — NOT a Databricks Runtime. Plans, partition counts and
shuffle settings are local (shuffle partitions set to 2; AQE off for the plan card). Everything here is plain
Spark SQL / DataFrame behaviour that also holds on Databricks, but the plan text is a local run's.

Writes under ./.verify-warehouse-ch05 (git-ignored).
"""
import os
import random
import re
import shutil
from decimal import Decimal

from delta import configure_spark_with_delta_pip
from pyspark.sql import SparkSession, Window, functions as F

ROOT = os.path.abspath(".verify-warehouse-ch05")
shutil.rmtree(ROOT, ignore_errors=True)
builder = (
    SparkSession.builder.master("local[2]").appName("ch05")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .config("spark.sql.warehouse.dir", os.path.join(ROOT, "wh"))
    .config("spark.ui.enabled", "false")
    .config("spark.sql.shuffle.partitions", "2")
    .config("spark.sql.adaptive.enabled", "false")  # so the plan card shows the Exchange, not an adaptive wrapper
    .config("spark.sql.session.timeZone", "UTC")
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()
spark.sparkContext.setLogLevel("ERROR")
sql = spark.sql
D = Decimal

# The Chapter 5 bronze events: the course's three landing files plus a later file d (o6 completes, plus two
# records that fail quality rules). All text, as sent. 11 rows.
EVENTS = [
    ("o1", "7", "40.00", "COMPLETED", "2026-10-01 09:01:00", "orders-a.csv"),
    ("o2", "7", "25.00", "COMPLETED", "2026-10-01 09:04:00", "orders-a.csv"),
    ("o3", "9", "60.00", "CANCELLED", "2026-10-01 09:08:00", "orders-a.csv"),
    ("o4", "9", "15.00", "COMPLETED", "2026-10-01 09:14:00", "orders-b.csv"),
    ("o5", "12", "80.00", "COMPLETED", "2026-10-01 09:17:00", "orders-b.csv"),
    ("o6", "7", "10.00", "PENDING", "2026-10-01 09:23:00", "orders-b.csv"),
    ("o4", "9", "15.00", "COMPLETED", "2026-10-01 09:14:00", "orders-c.csv"),  # resent, same event time
    ("o7", "9", "n/a", "COMPLETED", "2026-10-01 09:30:00", "orders-c.csv"),  # unreadable amount
    ("o6", "7", "10.00", "COMPLETED", "2026-10-01 09:41:00", "orders-d.csv"),  # a later event for o6
    ("o8", "12", "-5.00", "PENDING", "2026-10-01 09:44:00", "orders-d.csv"),  # negative amount
    ("o9", "15", "22.00", "COMPLETED", "2026-10-01 09:50:00", "orders-d.csv"),  # unknown store
]
spark.createDataFrame(EVENTS, "order_id string, store_id string, amount string, status string, event_ts string, source_file string") \
    .write.format("delta").saveAsTable("bronze_events")
# Reference data. stores_dup carries York twice (a resent reference file); stores is the clean version.
STORES = [(7, "Leeds"), (9, "York"), (12, "Hull")]
spark.createDataFrame(STORES, "store_id int, name string").write.format("delta").saveAsTable("stores")
spark.createDataFrame(STORES + [(9, "York")], "store_id int, name string").write.format("delta").saveAsTable("stores_dup")

# ---- §5.1 the Spark model: lazy, actions, a shuffle ----------------------------------------------------------
sc = spark.sparkContext
sc.setJobGroup("lazy-check", "no jobs expected until an action")
by_status = spark.table("bronze_events").groupBy("status").agg(F.count("*").alias("orders")).orderBy("status")
assert not sc.statusTracker().getJobIdsForGroup("lazy-check"), "building the DataFrame must not run a job"
result = [tuple(r) for r in by_status.collect()]
assert sc.statusTracker().getJobIdsForGroup("lazy-check"), "collect() is an action and must run a job"
assert result == [("CANCELLED", 1), ("COMPLETED", 8), ("PENDING", 2)], result
plan = spark.sql("SELECT status, count(*) orders FROM bronze_events GROUP BY status")._jdf.queryExecution().executedPlan().toString()
assert "Exchange hashpartitioning(status" in plan and plan.index("partial_count") > plan.index("Exchange"), plan
assert spark.table("bronze_events").rdd.getNumPartitions() >= 1 and spark.conf.get("spark.sql.shuffle.partitions") == "2"

# ---- §5.2 SQL and DataFrame say the same thing ---------------------------------------------------------------
q_sql = sql("SELECT store_id, count(*) n FROM bronze_events WHERE status='COMPLETED' GROUP BY store_id ORDER BY store_id")
q_df = spark.table("bronze_events").filter("status='COMPLETED'").groupBy("store_id").agg(F.count("*").alias("n")).orderBy("store_id")
assert q_sql.collect() == q_df.collect()
norm = lambda df: [re.sub(r"#\d+L?|plan_id=\d+", "", l).strip() for l in df._jdf.queryExecution().executedPlan().toString().split("\n")]  # noqa: E731
assert norm(q_sql) == norm(q_df)  # the same physical plan once expression ids are ignored

# ---- §5.3 parsing, NULL, time zones, nested data -------------------------------------------------------------
parsed = {r.amount_text: r.amount for r in sql(
    "SELECT DISTINCT amount AS amount_text, try_cast(amount AS DECIMAL(10,2)) AS amount FROM bronze_events").collect()}
assert parsed["40.00"] == D("40.00") and parsed["n/a"] is None and parsed["-5.00"] == D("-5.00")
assert sql("SELECT count(*) c FROM bronze_events WHERE try_cast(amount AS DECIMAL(10,2)) = NULL").collect()[0].c == 0
assert sql("SELECT count(*) c FROM bronze_events WHERE try_cast(amount AS DECIMAL(10,2)) IS NULL").collect()[0].c == 1
instants = {}
for tz in ("UTC", "America/New_York"):
    spark.conf.set("spark.sql.session.timeZone", tz)
    instants[tz] = sql("SELECT unix_timestamp(CAST('2026-10-01 09:14:00' AS TIMESTAMP)) u").collect()[0].u
spark.conf.set("spark.sql.session.timeZone", "UTC")
assert instants["America/New_York"] - instants["UTC"] == 14400  # same text, two instants, four hours apart
nested = spark.createDataFrame(
    [("o1", D("40.00"), [("A1", 2), ("B2", 1)]), ("o2", D("25.00"), [("A1", 1)])],
    "order_id string, amount decimal(10,2), items array<struct<sku:string,qty:int>>")
nested.createOrReplaceTempView("nested_orders")
assert sql("SELECT sum(amount) s FROM nested_orders").collect()[0].s == D("65.00")
assert sql("SELECT sum(amount) s FROM nested_orders LATERAL VIEW explode(items) t AS item").collect()[0].s == D("105.00")  # inflated
assert sql("SELECT count(*) c FROM nested_orders LATERAL VIEW explode(items) t AS item").collect()[0].c == 3

# ---- §5.5 / §5.6 data quality, quarantine, and deterministic deduplication -----------------------------------
sql("""CREATE OR REPLACE TEMP VIEW typed AS
       SELECT order_id, CAST(store_id AS INT) store_id, try_cast(amount AS DECIMAL(10,2)) amount, status,
              CAST(event_ts AS TIMESTAMP) event_ts, source_file FROM bronze_events""")
sql("""CREATE OR REPLACE TEMP VIEW checked AS
       SELECT t.*, CASE WHEN t.amount IS NULL THEN 'amount unreadable'
                        WHEN t.amount <= 0 THEN 'amount not positive'
                        WHEN s.store_id IS NULL THEN 'unknown store'
                        WHEN t.status NOT IN ('COMPLETED','CANCELLED','PENDING') THEN 'bad status' END AS reason
       FROM typed t LEFT JOIN stores s ON s.store_id = t.store_id""")
quarantine = {r.order_id: r.reason for r in sql("SELECT order_id, reason FROM checked WHERE reason IS NOT NULL").collect()}
assert quarantine == {"o7": "amount unreadable", "o8": "amount not positive", "o9": "unknown store"}, quarantine
assert sql("SELECT count(*) c FROM checked WHERE reason IS NULL").collect()[0].c == 8
sql("""CREATE TABLE silver_orders USING delta AS
       SELECT order_id, store_id, amount, status, event_ts, source_file FROM (
         SELECT *, row_number() OVER (PARTITION BY order_id ORDER BY event_ts DESC, source_file DESC) rn
         FROM checked WHERE reason IS NULL) WHERE rn = 1""")
silver = {r.order_id: (r.store_id, r.amount, r.status, r.source_file) for r in sql("SELECT * FROM silver_orders").collect()}
assert silver == {
    "o1": (7, D("40.00"), "COMPLETED", "orders-a.csv"), "o2": (7, D("25.00"), "COMPLETED", "orders-a.csv"),
    "o3": (9, D("60.00"), "CANCELLED", "orders-a.csv"), "o4": (9, D("15.00"), "COMPLETED", "orders-c.csv"),
    "o5": (12, D("80.00"), "COMPLETED", "orders-b.csv"), "o6": (7, D("10.00"), "COMPLETED", "orders-d.csv"),
}, silver
# Reconciliation: 11 events = 6 silver + 1 identical resend + 1 superseded o6 + 3 quarantined.
assert 11 == 6 + 1 + 1 + 3
assert sql("""SELECT count(*) c FROM checked c WHERE reason IS NULL AND order_id = 'o4'""").collect()[0].c == 2
assert sql("""SELECT count(*) c FROM checked c WHERE reason IS NULL AND order_id = 'o6'""").collect()[0].c == 2


def survivors(with_tiebreak):
    rows = [("o4", "t", f) for f in ("orders-a.csv", "orders-b.csv", "orders-c.csv", "orders-d.csv")]
    out = set()
    for seed in range(12):
        shuffled = rows[:]
        random.Random(seed).shuffle(shuffled)
        df = spark.createDataFrame(shuffled, "order_id string, ts string, source_file string").repartition(3)
        order = [F.col("ts").desc()] + ([F.col("source_file").desc()] if with_tiebreak else [])
        kept = df.withColumn("rn", F.row_number().over(Window.partitionBy("order_id").orderBy(*order))).filter("rn=1")
        out.add(kept.collect()[0].source_file)
    return out


assert survivors(True) == {"orders-d.csv"}  # a total order picks one row, always
assert len(survivors(False)) > 1  # on tied timestamps the survivor depends on the row order (12 shuffles tried)

# ---- §5.4 join cardinality: a duplicate reference row inflates a total -----------------------------------------
completed = "SELECT o.amount FROM silver_orders o JOIN {ref} s ON s.store_id = o.store_id WHERE o.status = 'COMPLETED'"
clean = sql(completed.format(ref="stores"))
dup = sql(completed.format(ref="stores_dup"))
assert (clean.count(), clean.agg(F.sum("amount")).collect()[0][0]) == (5, D("170.00"))
assert (dup.count(), dup.agg(F.sum("amount")).collect()[0][0]) == (6, D("185.00"))  # o4 counted twice: +15.00
guard = [tuple(r) for r in sql("SELECT store_id, count(*) n FROM stores_dup GROUP BY store_id HAVING count(*) > 1").collect()]
assert guard == [(9, 2)]

# ---- §5.7 / §5.8 the gold output, its contract, and the reconciliation -----------------------------------------
sql("""CREATE TABLE gold_sales (
         store_id INT COMMENT 'Store key; one row per store',
         store_name STRING COMMENT 'Store name from the reference data',
         orders BIGINT COMMENT 'Count of COMPLETED orders',
         sales DECIMAL(18,2) COMMENT 'Sum of amount over COMPLETED orders') USING delta""")
sql("ALTER TABLE gold_sales ADD CONSTRAINT sales_not_negative CHECK (sales >= 0)")
sql("""INSERT INTO gold_sales
       SELECT s.store_id, s.name, count(*), sum(o.amount)
       FROM silver_orders o JOIN stores s ON s.store_id = o.store_id WHERE o.status = 'COMPLETED'
       GROUP BY s.store_id, s.name""")
gold = [tuple(r) for r in sql("SELECT * FROM gold_sales ORDER BY store_id").collect()]
assert gold == [(7, "Leeds", 3, D("75.00")), (9, "York", 1, D("15.00")), (12, "Hull", 1, D("80.00"))], gold
assert sql("SELECT sum(sales) s FROM gold_sales").collect()[0].s == D("170.00")
assert sql("SELECT sum(amount) s FROM silver_orders WHERE status='COMPLETED'").collect()[0].s == D("170.00")  # detail = summary
assert sql("SELECT count(*) c FROM silver_orders WHERE status='COMPLETED'").collect()[0].c == sql("SELECT sum(orders) s FROM gold_sales").collect()[0].s
comments = {r.col_name: r.comment for r in sql("DESCRIBE gold_sales").collect() if r.comment}
assert comments["sales"].startswith("Sum of amount")
assert any("sales_not_negative" in str(r) for r in sql("SHOW TBLPROPERTIES gold_sales").collect())

print("OK: Chapter 5 facts reproduced (local PySpark 4.0.1 + Delta 4.0.0; plan text and partition counts are local)")
