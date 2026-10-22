"""Fresher silver: three micro-batches by MERGE, against one full rebuild."""
from pyspark.sql import functions as F

from retail import silver
from retail.session import build_session

BATCHES = [["orders-a.csv", "orders-b.csv"],
           ["orders-c.csv", "orders-d.csv", "orders-e.csv"],
           ["partner-1.csv"]]
MERGE = """MERGE INTO lab.silver_fresh t USING batch s
ON t.order_id = s.order_id
WHEN MATCHED AND s.source_file > t.source_file THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *"""

spark = build_session("latency")
valid = silver.checked(spark).where("reason IS NULL").drop("reason")
spark.sql("CREATE SCHEMA IF NOT EXISTS lab")
valid.limit(0).write.mode("overwrite").saveAsTable("lab.silver_fresh")
for files in BATCHES + BATCHES[1:2]:            # the middle batch replayed
    batch = valid.where(F.col("source_file").isin(files))
    silver.latest(batch).createOrReplaceTempView("batch")
    spark.sql(MERGE)
    print("after", ", ".join(files) + ":",
          spark.table("lab.silver_fresh").count(), "orders")

columns = spark.table("silver.orders").columns
fresh = spark.table("lab.silver_fresh").select(columns)
print("micro-batches equal the full rebuild:",
      sorted(fresh.collect()) == sorted(spark.table("silver.orders").collect()))
spark.stop()
