"""A second source: partner orders, keyed by a store CODE, landed in bronze."""
from pyspark.sql import SparkSession
from pyspark.sql import functions as F

LANDING = "data/landing/partner"
CHECKPOINT = "checkpoints/bronze_partner"
CODES = "data/reference/store_codes.csv"
RAW = "order_id STRING, store_code STRING, amount STRING, status STRING"


def ingest(spark: SparkSession) -> int:
    """Map each code to our store_id (an unknown code stays NULL, for the
    rules to quarantine) and append to bronze.orders; return its count."""
    codes = spark.read.option("header", True) \
        .schema("store_code STRING, store_id STRING").csv(CODES)
    query = (
        spark.readStream.option("header", True).schema(RAW).csv(LANDING)
        .withColumn("source_file", F.col("_metadata.file_name"))
        .join(codes, "store_code", "left")
        .select("order_id", "store_id", "amount", "status", "source_file")
        .writeStream.option("checkpointLocation", CHECKPOINT)
        .trigger(availableNow=True).toTable("bronze.orders")
    )
    query.awaitTermination()
    return spark.table("bronze.orders").count()
