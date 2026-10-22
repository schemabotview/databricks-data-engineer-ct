"""One million generated orders in fast.orders: the course's baseline."""
from pyspark.sql import functions as F

from fast.lab import files, files_read, generate, session, spread

spark = session("make-orders")
spark.sql("CREATE SCHEMA IF NOT EXISTS fast")
spread(generate(spark), 40).write.mode("overwrite").saveAsTable("fast.orders")

orders = spark.table("fast.orders")
rows, total = orders.agg(F.count("*"), F.sum("amount")).first()
print(f"rows {rows:,}, sum(amount) {total:,}: the checksum every layout keeps")
print(f"files {files(spark, 'fast.orders')},",
      f"opened by store_id = 7: {files_read(orders.where('store_id = 7'))}")
spark.stop()
