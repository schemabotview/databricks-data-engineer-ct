"""A MODEL of the three expectation policies, over this project's quality rules.

Not a pipeline: plain Spark computing what warn, drop and fail would keep, by
the documented semantics, on the 11 bronze events.
"""
from retail import silver
from retail.quality import RULES
from retail.session import build_session

spark = build_session("policies")
rows = silver.checked(spark)  # each row, with the first rule it fails
total = rows.count()
for name, fails in RULES:
    print(f"{name:20} fails {rows.where(fails).count()} of {total}")

failing = rows.where("reason IS NOT NULL").count()
print(f"warn  (expect):         keeps {total}, records {failing} violations")
print(f"drop  (expect_or_drop): keeps {total - failing}, drops {failing}")
print("fail  (expect_or_fail): stops at the first violation, writes nothing")
spark.stop()
