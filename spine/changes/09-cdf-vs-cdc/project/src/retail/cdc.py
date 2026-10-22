"""Changes applied by sequence, not arrival: late and replayed ones are safe."""
from pyspark.sql import DataFrame, SparkSession, Window
from pyspark.sql import functions as F

CHANGES = ("order_id STRING, op STRING, seq INT, store_id INT, "
           "amount DECIMAL(10,2), status STRING")

APPLY = """
MERGE INTO {table} t USING changes s ON t.order_id = s.order_id
WHEN MATCHED AND s.seq > t.seq THEN UPDATE SET
  store_id = s.store_id, amount = s.amount, status = s.status,
  seq = s.seq, is_deleted = (s.op = 'D')
WHEN NOT MATCHED THEN
  INSERT (order_id, store_id, amount, status, seq, is_deleted)
  VALUES (s.order_id, s.store_id, s.amount, s.status, s.seq, s.op = 'D')"""


def create(spark: SparkSession, table: str, feed: bool = False) -> None:
    spark.sql(f"""CREATE OR REPLACE TABLE {table} (order_id STRING,
        store_id INT, amount DECIMAL(10,2), status STRING, seq INT,
        is_deleted BOOLEAN)
        TBLPROPERTIES (delta.enableChangeDataFeed = {str(feed).lower()})""")


def apply(spark: SparkSession, table: str, changes: DataFrame) -> None:
    """MERGE a batch: its newest record per key, and only if newer than ours."""
    newest = Window.partitionBy("order_id").orderBy(F.col("seq").desc())
    changes.withColumn("n", F.row_number().over(newest)).where("n = 1") \
        .createOrReplaceTempView("changes")
    spark.sql(APPLY.format(table=table))
