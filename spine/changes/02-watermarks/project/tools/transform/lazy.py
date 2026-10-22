"""Lazy plans, actions and a shuffle — counted from the running Spark."""
from pyspark.sql import functions as F

from retail.session import build_session

spark = build_session("lazy")
tracker = spark.sparkContext.statusTracker()
spark.sparkContext.setJobGroup("lesson", "jobs this lesson runs")

by_status = (spark.table("bronze.orders").groupBy("status")
             .agg(F.count("*").alias("orders")).orderBy("status"))
print("jobs after building the plan:", len(tracker.getJobIdsForGroup("lesson")))
rows = by_status.collect()  # an action: now Spark runs it
print("jobs after collect():", len(tracker.getJobIdsForGroup("lesson")))
print(", ".join(f"{r.status} {r.orders}" for r in rows))

plan = by_status._jdf.queryExecution().executedPlan().toString()
for line in plan.splitlines():
    if "Exchange" in line:  # a shuffle: rows move between partitions
        print("shuffle:", line.strip("+- ").split(",")[0])
spark.stop()
