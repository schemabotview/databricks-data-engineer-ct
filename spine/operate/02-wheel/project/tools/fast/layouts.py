"""Five layouts of the same million orders: files opened per filter."""
from pyspark.sql import functions as F

from lab import files, files_read, generate, session, spread

spark = session("layouts")
sql = spark.sql
sql("CREATE TABLE fast.zorder AS SELECT * FROM fast.orders")
sql("OPTIMIZE fast.zorder")                        # compaction only
compacted = files(spark, "fast.zorder"), files_read(
    spark.table("fast.zorder").where("store_id = 7"))
sql("OPTIMIZE fast.zorder ZORDER BY (store_id)")
sql("CREATE TABLE fast.liquid CLUSTER BY (store_id) AS "
    "SELECT * FROM fast.orders")
sql("OPTIMIZE fast.liquid")                        # clusters by store_id
spread(generate(spark), 40).write.partitionBy("order_date") \
    .saveAsTable("fast.by_date")

print(f"{'layout':17}{'files':>6}{'store_id = 7':>14}{'customer_id = 5':>17}")
print(f"{'compaction only':17}{compacted[0]:>6}{compacted[1]:>14}")
NAMES = {"orders": "no layout", "zorder": "Z-order", "liquid": "liquid",
         "by_date": "by order_date"}
for table, name in NAMES.items():
    t = spark.table(f"fast.{table}")
    print(f"{name:17}{files(spark, f'fast.{table}'):>6}",
          f"{files_read(t.where('store_id = 7')):>13}",
          f"{files_read(t.where('customer_id = 5')):>16}")
generate(spark).write.partitionBy("customer_id").saveAsTable("fast.by_customer")
print("by customer_id:", files(spark, "fast.by_customer"), "files")
by_day = spark.table("fast.by_date").where("order_date = '2026-09-03'")
print("by order_date, one date:", files_read(by_day), "files opened")
for table in ("orders", "zorder", "liquid", "by_date"):
    rows, total = spark.table(f"fast.{table}") \
        .agg(F.count("*"), F.sum("amount")).first()
    assert (rows, str(total)) == (1_000_000, "50497436.00"), table
print("every layout: 1,000,000 rows, sum 50,497,436.00")
spark.stop()
