"""What DROP TABLE does to the files: a managed table, then an external one."""
from pathlib import Path

from retail.session import build_session

spark = build_session("drop-demo")
spark.sql("CREATE SCHEMA IF NOT EXISTS scratch")
external = Path("data/external/orders").resolve()

# managed: no LOCATION — the catalog picks the folder, and owns the files
spark.sql("CREATE TABLE scratch.managed USING delta "
          "AS SELECT * FROM bronze.orders")
# external: we name the folder, so the files are ours
spark.sql(f"CREATE TABLE scratch.external USING delta LOCATION '{external}' "
          "AS SELECT * FROM bronze.orders")

managed = Path("spark-warehouse/scratch.db/managed")
print("before DROP: managed", managed.exists(), "| external", external.exists())
spark.sql("DROP TABLE scratch.managed")
spark.sql("DROP TABLE scratch.external")
print("after DROP:  managed", managed.exists(), "| external", external.exists())
rows = spark.read.format("delta").load(str(external)).count()
print("rows still in the external files:", rows)
spark.stop()
