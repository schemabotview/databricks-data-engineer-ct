"""Shared by Course 11: a session for the measurements, and how to count."""
import json
import urllib.request

from pyspark.sql import functions as F

from retail.session import build_session

N = 1_000_000


def session(app: str):
    spark = build_session(app)
    spark.conf.set("spark.sql.shuffle.partitions", "4")
    spark.conf.set("spark.sql.adaptive.enabled", "false")  # fixed plans
    # a small target file size, so a million rows make several files
    spark.conf.set("spark.databricks.delta.optimize.maxFileSize", "400000")
    return spark


def h(buckets: int, salt: int):  # a deterministic number from the order id
    return F.pmod(F.hash(F.col("order_id"), F.lit(salt)), F.lit(buckets))


def generate(spark):
    """One million orders, the same every time: hashed, never random."""
    return spark.range(N).select(F.col("id").alias("order_id")).select(
        "order_id",
        (h(50, 1) + 1).cast("int").alias("store_id"),
        F.date_add(F.lit("2026-09-01").cast("date"), h(30, 2).cast("int"))
        .alias("order_date"),
        (h(100, 3) + 1).cast("decimal(10,2)").alias("amount"),
        F.when(h(10, 4) < 8, "COMPLETED").otherwise("PENDING").alias("status"),
        h(1000, 5).cast("int").alias("customer_id"))


def spread(df, files: int):
    """About `files` files, each holding rows of every store: no layout."""
    return df.withColumn("fk", h(files, 9)).repartition(files, "fk").drop("fk")


def files_read(df) -> int:
    """Run `df`, then the scan's numFiles: files opened after skipping."""
    df.collect()
    leaves = df._jdf.queryExecution().executedPlan().collectLeaves()
    return [int(leaf.metrics().apply("numFiles").value())
            for leaf in (leaves.apply(i) for i in range(leaves.size()))
            if leaf.metrics().contains("numFiles")][0]


def files(spark, table: str) -> int:
    return spark.sql(f"DESCRIBE DETAIL {table}").first().numFiles


def rest(spark, path: str):
    """The Spark UI's REST API: the numbers behind its pages."""
    sc = spark.sparkContext
    url = f"{sc.uiWebUrl}/api/v1/applications/{sc.applicationId}/{path}"
    return json.load(urllib.request.urlopen(url))
