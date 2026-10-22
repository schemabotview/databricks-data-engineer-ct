"""Bronze: every order file that lands, read once, kept as it arrived."""
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

LANDING = "data/landing/orders"
CHECKPOINT = "checkpoints/bronze_orders"
RAW = "order_id STRING, store_id STRING, amount STRING, status STRING"


def ingest(spark: SparkSession) -> int:
    """Read the files that arrived since the last run; return the row count."""
    spark.sql("CREATE SCHEMA IF NOT EXISTS bronze")
    query = (
        spark.readStream.option("header", True).schema(RAW).csv(LANDING)
        .withColumn("source_file", F.col("_metadata.file_name"))
        .writeStream.option("checkpointLocation", CHECKPOINT)
        .trigger(availableNow=True)   # read what is there, then stop
        .toTable("bronze.orders")
    )
    query.awaitTermination()
    return spark.table("bronze.orders").count()
