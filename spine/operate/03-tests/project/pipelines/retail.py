# Documented, not run: Lakeflow Declarative Pipelines need a workspace.
# Names checked through search summaries of the docs; re-check before use.
from pyspark import pipelines as dp
from pyspark.sql import functions as F

LANDING = "/Volumes/retail/bronze/landing/orders/"


@dp.table(comment="Every order file that landed, as it arrived")
def bronze_orders():
    return (spark.readStream.format("cloudFiles")
            .option("cloudFiles.format", "csv").option("header", "true")
            .load(LANDING)
            .withColumn("source_file", F.col("_metadata.file_name")))


@dp.table(comment="Typed, checked orders")
@dp.expect_or_drop("amount_readable", "amount IS NOT NULL")
@dp.expect_or_drop("amount_positive", "amount > 0")
@dp.expect("status_known", "status IN ('COMPLETED','CANCELLED','PENDING')")
def silver_orders():
    return spark.readStream.table("bronze_orders").select(
        "order_id", F.col("store_id").try_cast("int").alias("store_id"),
        F.col("amount").try_cast("decimal(10,2)").alias("amount"),
        "status", "source_file")


@dp.materialized_view(comment="Completed sales per city")
def gold_sales():
    stores = spark.read.table("retail.reference.stores")
    return (spark.read.table("silver_orders").where("status = 'COMPLETED'")
            .join(stores, "store_id").groupBy("city")
            .agg(F.count("*").alias("orders"), F.sum("amount").alias("sales")))
