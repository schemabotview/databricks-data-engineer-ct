"""Two objectives, measured: rows that pass the rules, and freshness."""
from pyspark.sql import functions as F

from retail import silver
from retail.session import build_session

QUALITY = 95.0       # illustrative: % of events that pass the rules
FRESHNESS = 15       # illustrative: minutes from landing to silver
NOW = "2026-10-01 10:20:00"   # a fixed clock, so the result repeats

spark = build_session("objectives")
rows = silver.checked(spark)
passed, total = rows.where("reason IS NULL").count(), rows.count()
share = round(100 * passed / total, 1)
print(f"quality:   {passed} of {total} pass = {share}%, objective {QUALITY}%",
      "→ met" if share >= QUALITY else "→ breached")

landed = spark.read.text("data/landing/orders") \
    .select(F.max("_metadata.file_modification_time")).first()[0]
lag = spark.sql(f"SELECT timestampdiff(MINUTE, TIMESTAMP '{landed}', "
                f"TIMESTAMP '{NOW}')").first()[0]
print(f"freshness: last file {landed:%H:%M}, now {NOW[11:16]} → {lag} min,",
      f"objective {FRESHNESS} min",
      "→ met" if lag <= FRESHNESS else "→ breached")
spark.stop()
