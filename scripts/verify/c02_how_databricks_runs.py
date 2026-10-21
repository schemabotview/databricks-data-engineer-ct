"""Reproduces the local outputs quoted in Course 2 (`how-databricks-runs`), §4 and §5.

Local PySpark 4.0.1 + Delta Lake 4.0.0 on local[2] — NOT a Databricks Runtime. It shows what the local
stack IS (§4) and the two things a local session cannot do that Unity Catalog does (§5): resolve a
three-part name, and accept a GRANT. Setup and run as in ch01_foundations.py.

Writes a throwaway table under ./.verify-warehouse-c02 (git-ignored).
"""
import importlib.metadata as md
import os
import shutil
import sys

import pyspark
from delta import configure_spark_with_delta_pip
from pyspark.sql import SparkSession

WH = os.path.abspath(".verify-warehouse-c02")
shutil.rmtree(WH, ignore_errors=True)
builder = (
    SparkSession.builder.master("local[2]").appName("c02")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .config("spark.sql.warehouse.dir", WH)
    .config("spark.ui.enabled", "false")
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()
spark.sparkContext.setLogLevel("OFF")

# §4 — the local stack this course runs on.
java = spark.sparkContext._jvm.java.lang.System.getProperty("java.version")
stack = (sys.version.split()[0][:4], pyspark.__version__, spark.version, md.version("delta-spark"), java.split(".")[0])
assert stack == ("3.13", "4.0.1", "4.0.1", "4.0.0", "21"), stack
assert spark.conf.get("spark.master") == "local[2]"

# §5 — one local catalog, two-part names, no grants.
spark.sql("CREATE SCHEMA silver")
spark.createDataFrame([("o1", 7, "40.00", "COMPLETED")], "order_id string, store_id int, amount string, status string") \
    .write.format("delta").saveAsTable("silver.orders")
assert [r.catalog for r in spark.sql("SHOW CATALOGS").collect()] == ["spark_catalog"]
assert spark.table("silver.orders").count() == 1
assert spark.table("spark_catalog.silver.orders").count() == 1
loc = [r.data_type for r in spark.sql("DESCRIBE TABLE EXTENDED silver.orders").collect() if r.col_name == "Location"][0]
assert loc.endswith("/.verify-warehouse-c02/silver.db/orders"), loc


def error(sql):
    try:
        spark.sql(sql).collect()
    except Exception as e:  # noqa: BLE001 — the message is the evidence
        return str(e)
    raise AssertionError(f"{sql} did not fail")


three = error("SELECT * FROM retail.silver.orders")
assert "[REQUIRES_SINGLE_PART_NAMESPACE] spark_catalog requires a single-part namespace, but got `retail`.`silver`." in three, three
grant = error("GRANT SELECT ON TABLE silver.orders TO `finance`")
assert "[INVALID_STATEMENT_OR_CLAUSE] The statement or clause: GRANT is not valid." in grant, grant
print("OK: Course 2 local outputs reproduced")
