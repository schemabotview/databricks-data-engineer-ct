"""An integration test and two data-quality checks, on the sample files."""
import pytest

from retail import bronze, gold, silver


@pytest.fixture(scope="module")
def built(spark):
    events = bronze.ingest(spark)
    silver.build(spark)
    gold.build(spark)
    return events


def count(spark, table):
    return spark.table(table).count()


def test_flow_builds_gold(spark, built):             # integration
    total = spark.sql("SELECT sum(sales) FROM gold.sales").first()[0]
    assert (built, str(total)) == (11, "170.00")


def test_every_event_is_accounted_for(spark, built):  # data quality
    kept, bad = count(spark, "silver.orders"), count(spark, "silver.quarantine")
    distinct = spark.table("bronze.orders").drop("source_file") \
        .distinct().count()
    resent = built - distinct
    superseded = built - kept - bad - resent
    assert (kept, resent, superseded, bad) == (6, 1, 1, 3)


def test_gold_equals_silver(spark, built):            # data quality
    detail = spark.sql("SELECT sum(amount) FROM silver.orders "
                       "WHERE status = 'COMPLETED'").first()[0]
    summary = spark.sql("SELECT sum(sales) FROM gold.sales").first()[0]
    assert detail == summary
