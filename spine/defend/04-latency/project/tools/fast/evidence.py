"""The Spark UI's evidence, read from its REST API: tasks and their rows."""
from pyspark.sql import functions as F

from lab import generate, h, rest, session

spark = session("evidence")
orders = generate(spark)
skewed = orders.withColumn(          # 80% of orders moved to store 7
    "store_id", F.when(h(10, 7) < 8, F.lit(7)).otherwise(F.col("store_id")))
skewed.repartition(4, "store_id").write.format("noop").mode("overwrite").save()

stage = max((s for s in rest(spark, "stages") if s["numTasks"] == 4),
            key=lambda s: s["stageId"])
summary = rest(spark, f"stages/{stage['stageId']}/0/taskSummary"
                      "?quantiles=0.0,0.25,0.5,0.75,1.0")
read = summary["shuffleReadMetrics"]["readRecords"]
print("rows read per task, min / 25% / median / 75% / max:")
print("  ", " / ".join(f"{int(n):,}" for n in read))

tiny = spark.range(1000).select((F.col("id") % 50).alias("store_id"), "id")
for partitions, adaptive in (("200", "false"), ("4", "false"),
                             ("200", "true")):
    spark.conf.set("spark.sql.shuffle.partitions", partitions)
    spark.conf.set("spark.sql.adaptive.enabled", adaptive)
    tiny.groupBy("store_id").count().write.format("noop") \
        .mode("overwrite").save()
    job = max(rest(spark, "jobs"), key=lambda j: j["jobId"])
    last = rest(spark, f"stages/{max(job['stageIds'])}")[0]  # the GROUP BY
    print(f"1,000 rows, shuffle.partitions {partitions:>3}, AQE {adaptive:5}:",
          f"{last['numTasks']} tasks to aggregate")
spark.stop()
