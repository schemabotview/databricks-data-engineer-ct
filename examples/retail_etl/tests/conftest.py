import pytest
from pyspark.sql import SparkSession


@pytest.fixture(scope="session")
def spark():
    session = (SparkSession.builder.master("local[2]").appName("retail-etl-tests")
               .config("spark.ui.enabled", "false").config("spark.sql.shuffle.partitions", "2")
               .config("spark.sql.session.timeZone", "UTC").getOrCreate())
    yield session
    session.stop()


EVENTS = [  # the Chapter 5 bronze events: id, store, amount, status, event time, file
    ("o1", "7", "40.00", "COMPLETED", "2026-10-01 09:01:00", "orders-a.csv"),
    ("o2", "7", "25.00", "COMPLETED", "2026-10-01 09:04:00", "orders-a.csv"),
    ("o3", "9", "60.00", "CANCELLED", "2026-10-01 09:08:00", "orders-a.csv"),
    ("o4", "9", "15.00", "COMPLETED", "2026-10-01 09:14:00", "orders-b.csv"),
    ("o5", "12", "80.00", "COMPLETED", "2026-10-01 09:17:00", "orders-b.csv"),
    ("o6", "7", "10.00", "PENDING", "2026-10-01 09:23:00", "orders-b.csv"),
    ("o4", "9", "15.00", "COMPLETED", "2026-10-01 09:14:00", "orders-c.csv"),
    ("o7", "9", "n/a", "COMPLETED", "2026-10-01 09:30:00", "orders-c.csv"),
    ("o6", "7", "10.00", "COMPLETED", "2026-10-01 09:41:00", "orders-d.csv"),
    ("o8", "12", "-5.00", "PENDING", "2026-10-01 09:44:00", "orders-d.csv"),
    ("o9", "15", "22.00", "COMPLETED", "2026-10-01 09:50:00", "orders-d.csv"),
]


@pytest.fixture()
def raw(spark):
    return spark.createDataFrame(EVENTS, "order_id string, store_id string, amount string, status string, event_ts string, source_file string")


@pytest.fixture()
def stores(spark):
    return spark.createDataFrame([(7, "Leeds"), (9, "York"), (12, "Hull")], "store_id int, name string")
