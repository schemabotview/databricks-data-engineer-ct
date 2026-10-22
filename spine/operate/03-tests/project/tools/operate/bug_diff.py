"""A bug that runs without an error: the oldest file wins, not the newest."""
import sys

from pyspark.sql import Window
from pyspark.sql import functions as F

from retail import silver
from retail.session import build_session

sys.path.insert(0, "tests")
from helpers import assert_rows_equal, rows  # noqa: E402


def earliest(df):  # the bug: ascending, so the OLDEST file wins
    oldest = Window.partitionBy("order_id").orderBy(F.col("source_file"))
    return df.withColumn("n", F.row_number().over(oldest)).where("n = 1")


spark = build_session("bug")
valid = silver.checked(spark).where("reason IS NULL")
expected = rows(silver.latest(valid), "order_id", "status", "source_file")
try:
    assert_rows_equal(rows(earliest(valid), "order_id", "status",
                           "source_file"), expected)
except AssertionError as error:
    print(error)
spark.stop()
