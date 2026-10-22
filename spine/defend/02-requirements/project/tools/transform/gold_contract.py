"""The gold table's contract, read back — and a write that breaks it."""
from retail import gold, silver
from retail.errors import reason
from retail.session import build_session

spark = build_session("gold-contract")
silver.build(spark)
gold.build(spark)
spark.sql("DESCRIBE TABLE gold.sales").show(truncate=False)
try:
    spark.sql("INSERT INTO gold.sales VALUES ('Leeds', 1, -5.00)")
except Exception as error:
    print("refused:", reason(error))
spark.stop()
