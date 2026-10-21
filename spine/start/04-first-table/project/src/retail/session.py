"""The project's one way to start Spark: local, with Delta and a catalog."""
import os

from delta import configure_spark_with_delta_pip
from pyspark.sql import SparkSession


def build_session(app: str = "retail-lakehouse") -> SparkSession:
    os.environ.setdefault("SPARK_CONF_DIR", "conf")  # quiet logs: see conf/
    builder = (
        SparkSession.builder.master("local[2]")
        .appName(app)
        # Delta: its SQL commands, and its catalog for the tables we create
        .config("spark.sql.extensions",
                "io.delta.sql.DeltaSparkSessionExtension")
        .config("spark.sql.catalog.spark_catalog",
                "org.apache.spark.sql.delta.catalog.DeltaCatalog")
        # a catalog kept on disk: a local stand-in for Unity Catalog
        .enableHiveSupport()
    )
    # adds Delta's jars to spark.jars.packages, fetched once from Maven
    return configure_spark_with_delta_pip(builder).getOrCreate()


if __name__ == "__main__":
    from importlib.metadata import version

    spark = build_session()
    print(f"Spark {spark.version}, Delta {version('delta-spark')}, "
          f"master {spark.sparkContext.master}")
    print(spark.conf.get("spark.sql.catalog.spark_catalog"))
    print(f"warehouse {spark.conf.get('spark.sql.warehouse.dir')}")
    spark.stop()
