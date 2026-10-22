"""Source to bronze, counted: every file, every row, every duplicate."""
from retail import bronze
from retail.session import build_session

spark = build_session("reconcile")
bronze.ingest(spark)
orders = spark.table("bronze.orders")

orders.groupBy("source_file").count().orderBy("source_file").show()
print("rows:", orders.count(), "| order ids:",
      orders.select("order_id").distinct().count())
orders.groupBy("order_id").count().where("count > 1") \
    .join(orders, "order_id").select("order_id", "amount", "source_file").show()
spark.stop()
