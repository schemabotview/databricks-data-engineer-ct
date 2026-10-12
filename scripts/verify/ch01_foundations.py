"""Reproduces every number and output shown in Chapter 1 (course `foundations`).

Local PySpark 4.0.1 + Delta Lake 4.0.0 on local[2] — NOT a Databricks workspace.
Setup:  python3 -m venv .venv && .venv/bin/pip install "pyspark==4.0.1" "delta-spark==4.0.0" "pandas<3"
Run:    .venv/bin/python scripts/verify/ch01_foundations.py   (needs Java 17/21 and PyPI/Maven Central)

Writes Delta tables under ./.verify-warehouse (git-ignored). Asserts the facts the slides quote.
"""
import glob
import json
import os
import shutil
from decimal import Decimal

from delta import configure_spark_with_delta_pip
from pyspark.sql import SparkSession, functions as F

WH = os.path.abspath(".verify-warehouse")
shutil.rmtree(WH, ignore_errors=True)
builder = (
    SparkSession.builder.master("local[2]").appName("ch01")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .config("spark.sql.warehouse.dir", WH)
    .config("spark.ui.enabled", "false")
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()
spark.sparkContext.setLogLevel("ERROR")

# The frozen Chapter 1 sample: the six orders plus a resent o4 and an o7 whose amount is unreadable.
rows = [
    ("o1", "7", "40.00", "COMPLETED"), ("o2", "7", "25.00", "COMPLETED"), ("o3", "9", "60.00", "CANCELLED"),
    ("o4", "9", "15.00", "COMPLETED"), ("o5", "12", "80.00", "COMPLETED"), ("o6", "7", "10.00", "PENDING"),
    ("o4", "9", "15.00", "COMPLETED"), ("o7", "9", "n/a", "COMPLETED"),
]
spark.createDataFrame(rows, "order_id string, store_id string, amount string, status string") \
    .write.format("delta").saveAsTable("bronze_orders")

# §1.5 — the first query, in SQL and in PySpark, must agree.
sql_rows = spark.sql("SELECT status, count(*) AS orders FROM bronze_orders GROUP BY status ORDER BY status").collect()
py_rows = spark.table("bronze_orders").groupBy("status").agg(F.count("*").alias("orders")).orderBy("status").collect()
assert sql_rows == py_rows
assert [tuple(r) for r in sql_rows] == [("CANCELLED", 1), ("COMPLETED", 6), ("PENDING", 1)]
distinct_completed = spark.sql(
    """SELECT count(DISTINCT order_id) c FROM bronze_orders
       WHERE status='COMPLETED' AND try_cast(amount AS DECIMAL(10,2)) IS NOT NULL"""
).collect()[0].c
assert distinct_completed == 4

# §1.6 — silver and gold exactly as shown on the board.
spark.sql(
    """CREATE TABLE silver_orders USING delta AS
       SELECT DISTINCT order_id, CAST(store_id AS INT) AS store_id,
              CAST(amount AS DECIMAL(10,2)) AS amount, status
       FROM bronze_orders WHERE try_cast(amount AS DECIMAL(10,2)) IS NOT NULL"""
)
spark.sql(
    """CREATE TABLE gold_sales USING delta AS
       SELECT store_id, count(*) AS orders, sum(amount) AS sales
       FROM silver_orders WHERE status='COMPLETED' GROUP BY store_id"""
)
assert spark.table("bronze_orders").count() == 8
assert spark.table("silver_orders").count() == 6
gold = [tuple(r) for r in spark.table("gold_sales").orderBy("store_id").collect()]
assert gold == [(7, 2, Decimal("65.00")), (9, 1, Decimal("15.00")), (12, 1, Decimal("80.00"))], gold
assert str(spark.sql("SELECT sum(sales) s FROM gold_sales").collect()[0].s) == "160.00"

# §1.2 — what one Delta table looks like on disk.
detail = spark.sql("DESCRIBE DETAIL bronze_orders").collect()[0]
history = spark.sql("DESCRIBE HISTORY bronze_orders").collect()
assert detail.format == "delta" and detail.numFiles == 2
assert [(h.version, h.operation) for h in history] == [(0, "CREATE TABLE AS SELECT")]
log = glob.glob(os.path.join(WH, "bronze_orders", "_delta_log", "*.json"))
assert [os.path.basename(p) for p in log] == ["00000000000000000000.json"]
with open(log[0]) as f:
    actions = [next(iter(json.loads(line))) for line in f]
assert actions == ["commitInfo", "metaData", "protocol", "add", "add"], actions

print("OK: Chapter 1 facts reproduced (file count depends on local partitioning; Databricks may differ)")
