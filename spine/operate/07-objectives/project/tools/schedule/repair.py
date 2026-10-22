"""After a failure: repair, a full rerun, and a retry after a write."""
from jobs import run
from retail.session import build_session
from tasks import context, count, retail_daily

spark = build_session("repair")
ctx = context(spark, faults={"transform"})
first = run(retail_daily(), ctx)
run(retail_daily(), ctx, prior=first)          # repair: only what failed
total = spark.table("job.published").first().total
print(f"repair: bronze {count(ctx, 'bronze')}, published "
      f"{count(ctx, 'published')} row ({total}),",
      f"ingest ran {ctx['ran'].count('ingest')} time(s)")

for merge in (False, True):                     # a full rerun: every task
    ctx = context(spark, merge=merge, faults={"transform"})
    run(retail_daily(), ctx)
    run(retail_daily(), ctx)
    print(f"full rerun, {'merge' if merge else 'append'} ingest: bronze "
          f"{count(ctx, 'bronze')}, silver {count(ctx, 'silver')}")

for merge in (False, True):                     # publish wrote, then failed
    ctx = context(spark, merge=merge, faults={"publish"})
    run(retail_daily(publish_retries=1), ctx)
    print(f"retried publish, {'merge' if merge else 'append'}: "
          f"{count(ctx, 'published')} row(s) for one day")
spark.stop()
