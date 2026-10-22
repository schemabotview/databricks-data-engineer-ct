"""A plain batch load of the three sample files — run twice, by mistake."""
from retail.session import build_session

RAW = "order_id STRING, store_id STRING, amount STRING, status STRING"

spark = build_session("batch-twice")
spark.sql("CREATE SCHEMA IF NOT EXISTS lab")
spark.sql("DROP TABLE IF EXISTS lab.bronze_batch")
files = spark.read.option("header", True).schema(RAW).csv("data/samples")

for run in (1, 2):  # the scheduler retried it, or someone ran it again
    files.write.mode("append").saveAsTable("lab.bronze_batch")
    rows = spark.table("lab.bronze_batch")
    print(f"run {run}: {rows.count()} rows, "
          f"{rows.select('order_id').distinct().count()} order ids")
spark.stop()
