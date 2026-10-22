"""The first question, asked twice: how many orders are in each status?"""
from pyspark.sql import functions as F

from retail.session import build_session

spark = build_session("first-query")

in_sql = spark.sql("""
    SELECT status, count(*) AS orders
    FROM bronze.orders
    GROUP BY status
    ORDER BY status
""")
in_python = (spark.table("bronze.orders")
             .groupBy("status").agg(F.count("*").alias("orders"))
             .orderBy("status"))

in_sql.show()
print("PySpark gives the same rows:", in_python.collect() == in_sql.collect())
spark.stop()
