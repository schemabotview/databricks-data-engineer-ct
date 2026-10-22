# Databricks notebook source
# MAGIC %md
# MAGIC ## How many orders are there, really?

# COMMAND ----------

# On a workspace, `spark` already exists; here we build it, as a job does.
from retail.session import build_session
spark = build_session("explore")

# COMMAND ----------

orders = spark.table("bronze.orders")
print("rows:", orders.count())
print("order ids:", orders.select("order_id").distinct().count())
print("valid completed orders:", orders.where(
    "status = 'COMPLETED' AND try_cast(amount AS DECIMAL(10,2)) IS NOT NULL"
).select("order_id").distinct().count())
