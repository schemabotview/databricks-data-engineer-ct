"""Every bronze row against the rules: who passes, who fails, and why."""
from retail import silver
from retail.session import build_session

spark = build_session("quality")
rows = silver.checked(spark)
failed = rows.where("reason IS NOT NULL")
failed.select("order_id", "store_id", "amount", "reason") \
    .orderBy("order_id").show()
print("passed:", rows.where("reason IS NULL").count(),
      "| quarantined:", rows.where("reason IS NOT NULL").count())
spark.stop()
