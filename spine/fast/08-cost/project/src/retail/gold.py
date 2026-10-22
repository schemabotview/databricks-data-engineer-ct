"""Gold: completed sales per city — a table with a contract for its readers."""
from pyspark.sql import SparkSession

CONTRACT = """
CREATE TABLE IF NOT EXISTS gold.sales (
  city   STRING NOT NULL COMMENT 'Store city, from the stores reference',
  orders BIGINT NOT NULL COMMENT 'Number of COMPLETED orders',
  sales  DECIMAL(18,2) NOT NULL COMMENT 'Sum of amount over COMPLETED orders'
) COMMENT 'Completed sales per city. One row per city. Rebuilt every run.'
"""


def build(spark: SparkSession) -> None:
    spark.sql("CREATE SCHEMA IF NOT EXISTS gold")
    spark.sql(CONTRACT)
    props = spark.sql("SHOW TBLPROPERTIES gold.sales").collect()
    if "delta.constraints.sales_not_negative" not in [p.key for p in props]:
        spark.sql("ALTER TABLE gold.sales "
                  "ADD CONSTRAINT sales_not_negative CHECK (sales >= 0)")
    # INSERT OVERWRITE replaces the rows and keeps the contract
    spark.sql("""INSERT OVERWRITE gold.sales
                 SELECT city, count(*), sum(amount) FROM silver.orders
                 WHERE status = 'COMPLETED' GROUP BY city""")
