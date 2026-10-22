"""One row per order, the latest to arrive — and why ORDER BY must be total."""
import random

from pyspark.sql import Window
from pyspark.sql import functions as F

from retail.session import build_session

spark = build_session("latest")
orders = spark.table("bronze.orders")
latest = Window.partitionBy("order_id").orderBy(F.col("source_file").desc())
(orders.withColumn("n", F.row_number().over(latest))
    .where("order_id IN ('o4', 'o6')").orderBy("order_id", "n").show())

tied = Window.partitionBy("order_id").orderBy("amount")  # a tie for o4
kept = set()
for seed in range(12):  # the same rows, in twelve different orders
    rows = orders.where("order_id = 'o4'").collect()
    random.Random(seed).shuffle(rows)
    df = spark.createDataFrame(rows).repartition(3)
    kept.add(df.withColumn("n", F.row_number().over(tied))
               .where("n = 1").first().source_file)
print("ORDER BY amount alone kept:", sorted(kept))
spark.stop()
