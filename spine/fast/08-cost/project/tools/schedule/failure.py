"""A transform that fails: what is skipped, and the alert that still runs."""
from jobs import run
from retail.session import build_session
from tasks import context, retail_daily

spark = build_session("failure")
ctx = context(spark, faults={"transform"})
for task, state in run(retail_daily(), ctx).items():
    print(f"{task:10} {state}")
print("\n".join(ctx["log"]))
spark.stop()
