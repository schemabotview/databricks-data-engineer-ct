"""Reproduces and asserts every result quoted in Chapter 11 (course `integration`): the retail design under three
changed requirements, on local PySpark 4.0.1 + Delta Lake 4.0.0 — NOT a Databricks workspace. It reuses the real
example package (examples/retail_etl) for typing, rules, latest-per-order and the sales summary.

  1. the base design: the Chapter 5 events -> silver (6 orders) -> gold (170.00);
  2. a HISTORICAL CORRECTION: o4's amount changes from 15.00 to 18.00 in a later file;
  3. a NEW SOURCE: partner orders keyed by a store CODE, one of them unknown;
  4. a LATENCY change: the same logic applied as incremental micro-batches (a sequence-guarded MERGE) must equal
     the full recompute;
  5. the reconciliation of every input row, and the SCD type 2 history of the corrected order.

Everything about Databricks features (Unity Catalog, Auto Loader, pipelines, jobs, bundles) is documented, not run.
Writes under ./.verify-warehouse-ch11 (git-ignored).
"""
import os
import shutil
import sys
from decimal import Decimal

from delta import configure_spark_with_delta_pip
from delta.tables import DeltaTable
from pyspark.sql import SparkSession, functions as F

REPO = os.getcwd()
sys.path[:0] = [os.path.join(REPO, "examples", "retail_etl", "src")]
from retail_etl import transform as t  # noqa: E402

ROOT = os.path.abspath(".verify-warehouse-ch11")
shutil.rmtree(ROOT, ignore_errors=True)
os.makedirs(ROOT)
builder = (
    SparkSession.builder.master("local[2]").appName("ch11")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .config("spark.sql.warehouse.dir", os.path.join(ROOT, "wh"))
    .config("spark.ui.enabled", "false").config("spark.sql.shuffle.partitions", "2").config("spark.sql.session.timeZone", "UTC")
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()
spark.sparkContext.setLogLevel("ERROR")
sql = spark.sql
D = Decimal
COLS = "order_id string, store_id string, amount string, status string, event_ts string, source_file string"

BASE = [  # the Chapter 5 events (files a-d)
    ("o1", "7", "40.00", "COMPLETED", "2026-10-01 09:01:00", "orders-a.csv"),
    ("o2", "7", "25.00", "COMPLETED", "2026-10-01 09:04:00", "orders-a.csv"),
    ("o3", "9", "60.00", "CANCELLED", "2026-10-01 09:08:00", "orders-a.csv"),
    ("o4", "9", "15.00", "COMPLETED", "2026-10-01 09:14:00", "orders-b.csv"),
    ("o5", "12", "80.00", "COMPLETED", "2026-10-01 09:17:00", "orders-b.csv"),
    ("o6", "7", "10.00", "PENDING", "2026-10-01 09:23:00", "orders-b.csv"),
    ("o4", "9", "15.00", "COMPLETED", "2026-10-01 09:14:00", "orders-c.csv"),
    ("o7", "9", "n/a", "COMPLETED", "2026-10-01 09:30:00", "orders-c.csv"),
    ("o6", "7", "10.00", "COMPLETED", "2026-10-01 09:41:00", "orders-d.csv"),
    ("o8", "12", "-5.00", "PENDING", "2026-10-01 09:44:00", "orders-d.csv"),
    ("o9", "15", "22.00", "COMPLETED", "2026-10-01 09:50:00", "orders-d.csv"),
]
CORRECTION = [("o4", "9", "18.00", "COMPLETED", "2026-10-02 08:00:00", "orders-e.csv")]  # a later event for o4
PARTNER = [  # a new source: store CODES instead of store ids, and an unknown code
    ("p1", "LDS", "30.00", "COMPLETED", "2026-10-01 09:55:00", "partner-1.csv"),
    ("p2", "YRK", "12.00", "COMPLETED", "2026-10-01 10:05:00", "partner-1.csv"),
    ("p3", "XXX", "9.00", "COMPLETED", "2026-10-01 10:10:00", "partner-1.csv"),
]
stores = spark.createDataFrame([(7, "Leeds"), (9, "York"), (12, "Hull")], "store_id int, name string")
codes = spark.createDataFrame([("LDS", 7), ("YRK", 9), ("HUL", 12)], "store_code string, store_id int")
df = lambda rows: spark.createDataFrame(rows, COLS)  # noqa: E731


def partner_to_orders(partner_df):
    """Map a partner feed onto the common shape; an unknown store code becomes a NULL store_id, which the rules reject."""
    mapped = partner_df.withColumnRenamed("store_id", "store_code").join(codes, "store_code", "left")
    return mapped.select("order_id", F.col("store_id").cast("string").alias("store_id"), "amount", "status", "event_ts", "source_file")


def full_recompute(*feeds):
    """Everything from scratch: (silver, quarantined, gold)."""
    raw = feeds[0]
    for f in feeds[1:]:
        raw = raw.unionByName(f)
    return t.run(raw, stores)


gold_rows = lambda g: sorted((r.store_id, r.store_name, r.orders, r.sales) for r in g.collect())  # noqa: E731
total = lambda g: g.agg(F.sum("sales")).collect()[0][0]  # noqa: E731

# ---- 1. the base design ------------------------------------------------------------------------------------------------------
silver0, quar0, gold0 = full_recompute(df(BASE))
assert (silver0.count(), quar0.count()) == (6, 3) and total(gold0) == D("170.00")

# ---- 2. a historical correction -------------------------------------------------------------------------------------------------
silver1, quar1, gold1 = full_recompute(df(BASE), df(CORRECTION))
assert gold_rows(gold1) == [(7, "Leeds", 3, D("75.00")), (9, "York", 1, D("18.00")), (12, "Hull", 1, D("80.00"))]
assert total(gold1) == D("173.00") and silver1.count() == 6  # the correction REPLACED o4's amount; no new order
# the history of o4 (SCD type 2), ordered by event time: both versions exist, the first closed by the second
raw1 = df(BASE).unionByName(df(CORRECTION))
checked = t.apply_rules(t.type_orders(raw1), stores).filter("reason IS NULL").dropDuplicates(["order_id", "amount", "status", "event_ts"])
checked.createOrReplaceTempView("o4_events")
o4_history = [tuple(r) for r in sql("""
    SELECT amount, event_ts AS start_at, lead(event_ts) OVER (ORDER BY event_ts, source_file) AS end_at
    FROM o4_events WHERE order_id = 'o4' ORDER BY event_ts""").collect()]
assert [(h[0], str(h[1]), None if h[2] is None else str(h[2])) for h in o4_history] == [
    (D("15.00"), "2026-10-01 09:14:00", "2026-10-02 08:00:00"), (D("18.00"), "2026-10-02 08:00:00", None)], o4_history

# ---- 3. a new source --------------------------------------------------------------------------------------------------------------
partner_orders = partner_to_orders(df(PARTNER))
silver2, quar2, gold2 = full_recompute(df(BASE), df(CORRECTION), partner_orders)
assert silver2.count() == 8  # 6 + the two partner orders that mapped
assert {r.order_id: r.reason for r in t.apply_rules(t.type_orders(df(BASE).unionByName(df(CORRECTION)).unionByName(partner_orders)), stores)
        .filter("reason IS NOT NULL").collect()} == {"o7": "amount unreadable", "o8": "amount not positive", "o9": "unknown store",
                                                     "p3": "unknown store"}
assert gold_rows(gold2) == [(7, "Leeds", 4, D("105.00")), (9, "York", 2, D("30.00")), (12, "Hull", 1, D("80.00"))]
assert total(gold2) == D("215.00")  # 173.00 + 30.00 + 12.00; the unknown-code order is NOT counted

# ---- 5. reconciliation of every input row ------------------------------------------------------------------------------------------
all_rows = df(BASE).unionByName(df(CORRECTION)).unionByName(partner_orders)
n_in, n_silver, n_quar = all_rows.count(), silver2.count(), quar2.count()
assert (n_in, n_silver, n_quar) == (15, 8, 4)
# the other 3 are not lost: o4's resend, o4's superseded original, and o6's earlier PENDING event (all valid, all older)
assert n_in == n_silver + 3 + n_quar

# ---- 4. a latency change: micro-batches must equal the full recompute -----------------------------------------------------------------
sql("""CREATE TABLE silver_incremental (order_id STRING, store_id INT, amount DECIMAL(10,2), status STRING, event_ts TIMESTAMP,
       source_file STRING) USING delta""")
BATCHES = [df(BASE).filter("source_file IN ('orders-a.csv', 'orders-b.csv')"),
           df(BASE).filter("source_file IN ('orders-c.csv', 'orders-d.csv')").unionByName(df(CORRECTION)),
           partner_orders]
for batch in BATCHES:
    valid = t.latest_per_order(t.apply_rules(t.type_orders(batch), stores).filter("reason IS NULL").drop("reason"))
    (DeltaTable.forName(spark, "silver_incremental").alias("t")
     .merge(valid.alias("s"), "t.order_id = s.order_id")
     .whenMatchedUpdateAll(condition="struct(s.event_ts, s.source_file) > struct(t.event_ts, t.source_file)")
     .whenNotMatchedInsertAll().execute())
incremental = sorted(tuple(r) for r in spark.table("silver_incremental").collect())
batch_result = sorted(tuple(r) for r in silver2.select("order_id", "store_id", "amount", "status", "event_ts", "source_file").collect())
assert incremental == batch_result, (incremental, batch_result)  # same answer, delivered in three increments
assert total(t.sales_by_store(spark.table("silver_incremental"), stores)) == D("215.00")

print("OK: Chapter 11 reproduced (local; correction, new source, micro-batch equivalence, reconciliation; Databricks features documented, not run)")
