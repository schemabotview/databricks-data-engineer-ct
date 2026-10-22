"""The same question in SQL and in PySpark: same rows, and the same plan."""
import re

from pyspark.sql import functions as F

from retail.session import build_session

spark = build_session("same-plan")
in_sql = spark.sql("""SELECT store_id, count(*) AS n FROM bronze.orders
                      WHERE status = 'COMPLETED'
                      GROUP BY store_id ORDER BY store_id""")
in_python = (spark.table("bronze.orders")
             .where(F.col("status") == "COMPLETED")
             .groupBy("store_id").agg(F.count("*").alias("n"))
             .orderBy("store_id"))


def plan(df):  # the physical plan, without Spark's internal expression ids
    text = df._jdf.queryExecution().executedPlan().toString()
    return re.sub(r"#\d+L?|plan_id=\d+", "", text)


in_sql.show()
print("same rows:", in_sql.collect() == in_python.collect())
print("same plan:", plan(in_sql) == plan(in_python))
spark.stop()
