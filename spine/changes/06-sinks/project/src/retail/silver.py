"""Silver: bronze rows typed, checked, enriched, and one per order."""
from pyspark.sql import DataFrame, SparkSession, Window
from pyspark.sql import functions as F

from retail.quality import reason

STORES = "data/reference/stores.csv"


def checked(spark: SparkSession) -> DataFrame:
    """Every bronze row, typed, with its store's city and the rule it fails."""
    stores = spark.read.option("header", True) \
        .schema("store_id INT, city STRING").csv(STORES)
    typed = spark.table("bronze.orders").select(
        "order_id",
        F.col("store_id").try_cast("int").alias("store_id"),
        F.col("amount").try_cast("decimal(10,2)").alias("amount"),
        "status", "source_file")
    return typed.join(stores, "store_id", "left").withColumn("reason", reason())


def build(spark: SparkSession) -> None:
    """Rewrite silver.orders (latest valid row per order) and its quarantine."""
    rows = checked(spark)
    latest = Window.partitionBy("order_id").orderBy(F.col("source_file").desc())
    spark.sql("CREATE SCHEMA IF NOT EXISTS silver")
    rows.where("reason IS NOT NULL").write.mode("overwrite") \
        .saveAsTable("silver.quarantine")
    rows.where("reason IS NULL") \
        .withColumn("n", F.row_number().over(latest)).where("n = 1") \
        .drop("n", "reason") \
        .write.mode("overwrite").saveAsTable("silver.orders")
