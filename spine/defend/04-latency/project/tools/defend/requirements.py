"""Two changed requirements, through the project's own modules."""
import shutil
from pathlib import Path

from retail import bronze, gold, partner, silver
from retail.session import build_session


def land(sample, folder):
    Path(folder).mkdir(parents=True, exist_ok=True)
    shutil.copy(f"data/samples/{sample}", folder)


def rebuild(spark, label, ingest):
    events = ingest(spark)
    silver.build(spark)
    gold.build(spark)
    rows = spark.sql("SELECT * FROM gold.sales ORDER BY city").collect()
    total = spark.sql("SELECT sum(sales) FROM gold.sales").first()[0]
    kept = spark.table("silver.orders").count()
    bad = spark.table("silver.quarantine").count()
    print(f"{label}: bronze {events} = silver {kept} + older versions",
          f"{events - kept - bad} + quarantined {bad}")
    print("   ", " · ".join(f"{r.city} {r.orders} / {r.sales}" for r in rows),
          f"= {total}")


spark = build_session("requirements")
rebuild(spark, "base", bronze.ingest)                    # files a–d
land("orders-e.csv", "data/landing/orders")              # o4 corrected
rebuild(spark, "correction", bronze.ingest)
land("partner-1.csv", "data/landing/partner")            # a new source
rebuild(spark, "new source", partner.ingest)
spark.sql("SELECT order_id, reason FROM silver.quarantine "
          "ORDER BY order_id").show()
spark.stop()
