"""Parse permissively: keep the rows that fit, and the raw line of the rest."""
from retail.session import build_session

spark = build_session("malformed")
TYPED = ("order_id STRING, store_id INT, amount DECIMAL(10,2), status STRING, "
         "_bad_record STRING")

parsed = (spark.read.option("header", True)
          .option("mode", "PERMISSIVE")       # the default: never fail
          .option("columnNameOfCorruptRecord", "_bad_record")
          .schema(TYPED).csv("data/samples").cache())
good = parsed.where("_bad_record IS NULL")
bad = parsed.where("_bad_record IS NOT NULL")

bad.select("order_id", "amount", "_bad_record").show(truncate=False)
print(f"{parsed.count()} rows = {good.count()} parsed "
      f"+ {bad.count()} quarantined")
spark.stop()
