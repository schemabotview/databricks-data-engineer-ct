"""Job parameters in, a task value between tasks, and a condition on it."""
from jobs import run
from retail.session import build_session
from tasks import FILES, context, retail_daily

spark = build_session("params")
for files in (FILES, FILES[:2]):        # all three files, then c still missing
    ctx = context(spark, files)
    states = run(retail_daily(), ctx)
    print(f"{len(files)} files: rows_read = {ctx['values']['rows_read']},",
          f"expected_rows = {ctx['params']['expected_rows']}",
          f"→ rows_ok {ctx['outcome']['rows_ok']}, publish {states['publish']}")
spark.stop()
