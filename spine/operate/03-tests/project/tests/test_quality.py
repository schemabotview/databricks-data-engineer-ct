"""Unit tests: one rule or one function, on rows written in the test."""
from decimal import Decimal

from helpers import assert_rows_equal, rows
from pyspark.sql import functions as F

from retail.quality import reason
from retail.silver import latest

ROW = "order_id STRING, amount DECIMAL(10,2), city STRING, status STRING"


def first_reason(spark, amount, city):
    amount = None if amount is None else Decimal(amount)
    df = spark.createDataFrame([("o1", amount, city, "COMPLETED")], ROW)
    return df.select(reason()).first()[0]


def test_unreadable_amount(spark):
    assert first_reason(spark, None, "Leeds") == "amount unreadable"


def test_negative_amount(spark):
    assert first_reason(spark, "-5.00", "Leeds") == "amount not positive"


def test_unknown_store(spark):
    assert first_reason(spark, "40.00", None) == "unknown store"


def test_latest_keeps_the_newest_file(spark):
    df = spark.createDataFrame(
        [("o6", "PENDING", "orders-b.csv"),
         ("o6", "COMPLETED", "orders-d.csv")],
        "order_id STRING, status STRING, source_file STRING")
    assert_rows_equal(rows(latest(df), "order_id", "status"),
                      [("o6", "COMPLETED")])
    assert latest(df).where(F.col("status") == "PENDING").count() == 0
