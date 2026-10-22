"""The eight sample orders, exactly as they arrived, as bronze.orders."""
from retail.session import build_session

SAMPLE = [  # order_id, store_id, amount, status: all text, as sent
    ("o1", "7", "40.00", "COMPLETED"), ("o2", "7", "25.00", "COMPLETED"),
    ("o3", "9", "60.00", "CANCELLED"), ("o4", "9", "15.00", "COMPLETED"),
    ("o5", "12", "80.00", "COMPLETED"), ("o6", "7", "10.00", "PENDING"),
    ("o4", "9", "15.00", "COMPLETED"),  # resent by the till, unchanged
    ("o7", "9", "n/a", "COMPLETED"),  # the amount is not a number
]

spark = build_session("load-sample")
orders = spark.createDataFrame(
    SAMPLE, "order_id STRING, store_id STRING, amount STRING, status STRING")
spark.sql("CREATE SCHEMA IF NOT EXISTS bronze")
orders.write.format("delta").mode("overwrite").saveAsTable("bronze.orders")
print(f"bronze.orders: {spark.table('bronze.orders').count()} rows")
spark.stop()
