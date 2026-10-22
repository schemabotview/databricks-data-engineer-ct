"""One join, two strategies; then one hot store, and salting it."""
import re

from pyspark.sql import functions as F

from lab import generate, h, session

spark = session("joins")
orders = generate(spark).select("order_id", "store_id", "amount")
stores = spark.range(1, 51).select(
    F.col("id").cast("int").alias("store_id"),
    F.concat(F.lit("store-"), "id").alias("name"))


def plan(df):  # the join operator, and how many shuffles (Exchanges)
    text = df._jdf.queryExecution().executedPlan().toString()
    join = re.search(r"\w+HashJoin|SortMergeJoin", text).group(0)
    return f"{join}, {text.count('Exchange hashpartitioning')} shuffle(s)"


sales = lambda: orders.join(stores, "store_id").groupBy("name").sum("amount")
first = sorted(sales().collect())
print("default:          ", plan(sales()))
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "-1")  # no broadcast
print("broadcast off:    ", plan(sales()), "| same answer:",
      sorted(sales().collect()) == first)

skewed = orders.withColumn(
    "store_id", F.when(h(10, 7) < 8, F.lit(7)).otherwise(F.col("store_id")))


def per_partition(df, *keys):  # rows in each of 4 partitions, largest first
    parts = df.repartition(4, *keys).groupBy(F.spark_partition_id()).count()
    return sorted((r[1] for r in parts.collect()), reverse=True)


print("even stores:      ", per_partition(orders, "store_id"))
print("80% on store 7:   ", per_partition(skewed, "store_id"))
salted = skewed.withColumn("salt", h(64, 11))   # spread each store 64 ways
print("salted 64 ways:   ", per_partition(salted, "store_id", "salt"))
spark.stop()
