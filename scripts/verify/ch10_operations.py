"""Reproduces and asserts the LOCAL parts of Chapter 10 (course `operations`).

Local PySpark 4.0.1 + Delta Lake 4.0.0 — NOT a Databricks workspace. Declarative Automation Bundles
(`databricks.yml`), deployment, CI/CD against a workspace, secrets, system tables and run-as identities are
NOT run: the bundle files in examples/retail_etl are documented, not validated (`databricks bundle validate`
needs a workspace to authenticate against). What IS run here:

  1. the example project's tests (unit, integration, data-quality) — real pytest results;
  2. a deliberately buggy variant of one transformation, failing with a readable expected-vs-actual diff;
  3. a real wheel build, and what is (and is not) declared in it;
  4. deletion obligations: after a DELETE, old versions, the change feed and a derived table all still hold the
     deleted data, until VACUUM and a recompute;
  5. a data-quality and a freshness objective computed over the Chapter 5 events (illustrative objectives);
  6. the arithmetic of a hypothetical lag-versus-retention incident.

Run from the repo root:  .venv/bin/python scripts/verify/ch10_operations.py   (needs pytest and PyPI access)
Writes under ./.verify-warehouse-ch10 (git-ignored).
"""
import os
import shutil
import subprocess
import sys
import zipfile
from decimal import Decimal

from delta import configure_spark_with_delta_pip
from pyspark.sql import SparkSession, Window, functions as F

REPO = os.getcwd()
EXAMPLE = os.path.join(REPO, "examples", "retail_etl")
ROOT = os.path.abspath(".verify-warehouse-ch10")
shutil.rmtree(ROOT, ignore_errors=True)
os.makedirs(ROOT)
sys.path[:0] = [os.path.join(EXAMPLE, "src"), os.path.join(EXAMPLE, "tests")]

# ---- 1. the project's own tests ----------------------------------------------------------------------------------------
run = subprocess.run([sys.executable, "-m", "pytest", "-q", "-p", "no:cacheprovider"], cwd=EXAMPLE, capture_output=True, text=True,
                     env={**os.environ, "PYTHONPATH": os.path.join(EXAMPLE, "src")})
assert run.returncode == 0 and "7 passed" in run.stdout, run.stdout[-400:] + run.stderr[-400:]

builder = (
    SparkSession.builder.master("local[2]").appName("ch10")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .config("spark.sql.warehouse.dir", os.path.join(ROOT, "wh"))
    .config("spark.ui.enabled", "false").config("spark.sql.shuffle.partitions", "2").config("spark.sql.session.timeZone", "UTC")
    .config("spark.databricks.delta.retentionDurationCheck.enabled", "false")  # only for the VACUUM demonstration
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()
spark.sparkContext.setLogLevel("ERROR")
sql = spark.sql

from conftest import EVENTS  # noqa: E402  (the same eleven Chapter 5 events the tests use)
from helpers import assert_rows_equal, rows  # noqa: E402
from retail_etl import transform as t  # noqa: E402

raw = spark.createDataFrame(EVENTS, "order_id string, store_id string, amount string, status string, event_ts string, source_file string")
stores = spark.createDataFrame([(7, "Leeds"), (9, "York"), (12, "Hull")], "store_id int, name string")

# ---- 2. a buggy variant fails with a diff you can read -------------------------------------------------------------------
valid = t.apply_rules(t.type_orders(raw), stores).filter("reason IS NULL").drop("reason")


def earliest_per_order(df):  # the bug: ascending, so the OLDEST event wins
    order = Window.partitionBy("order_id").orderBy(F.col("event_ts").asc(), F.col("source_file").desc())
    return df.withColumn("rn", F.row_number().over(order)).filter("rn = 1").drop("rn")


expected = [("o4", "COMPLETED", "orders-c.csv"), ("o6", "COMPLETED", "orders-d.csv")]
assert_rows_equal(rows(t.latest_per_order(valid).filter("order_id IN ('o4', 'o6')"), "order_id", "status", "source_file"), expected)
try:
    assert_rows_equal(rows(earliest_per_order(valid).filter("order_id IN ('o4', 'o6')"), "order_id", "status", "source_file"), expected)
    raise SystemExit("the buggy variant should have failed the comparison")
except AssertionError as e:
    diff = str(e)
assert diff == "rows differ:\n  missing    ('o6', 'COMPLETED', 'orders-d.csv')\n  unexpected ('o6', 'PENDING', 'orders-b.csv')", diff

# ---- 3. a real wheel ------------------------------------------------------------------------------------------------------
wheel_dir = os.path.join(ROOT, "wheels")
build = subprocess.run([sys.executable, "-m", "pip", "wheel", EXAMPLE, "--no-deps", "-w", wheel_dir, "-q"], capture_output=True, text=True)
assert build.returncode == 0, build.stderr[-600:]
wheels = [f for f in os.listdir(wheel_dir) if f.endswith(".whl")]
assert wheels == ["retail_etl-0.1.0-py3-none-any.whl"], wheels
with zipfile.ZipFile(os.path.join(wheel_dir, wheels[0])) as z:
    names = sorted(z.namelist())
    metadata = z.read("retail_etl-0.1.0.dist-info/METADATA").decode()
assert "retail_etl/transform.py" in names and "retail_etl/__init__.py" in names
requires = [line for line in metadata.splitlines() if line.startswith("Requires-Dist")]
assert all("extra ==" in r for r in requires) and not any("pyspark" in r.lower() for r in metadata.splitlines() if r.startswith("Requires-Dist")), requires

# ---- 4. deletion obligations -----------------------------------------------------------------------------------------------
sql("""CREATE TABLE orders_pii (order_id STRING, customer STRING, amount DECIMAL(10,2)) USING delta
       TBLPROPERTIES (delta.enableChangeDataFeed = true)""")
sql("INSERT INTO orders_pii VALUES ('o1','c1',40.00),('o2','c1',25.00),('o3','c2',35.00)")
sql("CREATE TABLE spend_total USING delta AS SELECT sum(amount) AS total FROM orders_pii")  # a derived table, computed before the delete
sql("DELETE FROM orders_pii WHERE customer = 'c1'")  # version 2
current = lambda: sorted(r.order_id for r in sql("SELECT * FROM orders_pii").collect())  # noqa: E731
assert current() == ["o3"]
assert sorted(r.order_id for r in sql("SELECT * FROM orders_pii VERSION AS OF 1").collect()) == ["o1", "o2", "o3"]  # the past still has c1
feed = (spark.read.format("delta").option("readChangeFeed", "true").option("startingVersion", 2).table("orders_pii")
        .select("order_id", "customer", "_change_type").collect())
assert sorted((r.order_id, r.customer, r._change_type) for r in feed) == [("o1", "c1", "delete"), ("o2", "c1", "delete")]  # the feed has c1's values
assert sql("SELECT total FROM spend_total").collect()[0].total == Decimal("100.00")  # the derived table still counts c1: stale
sql("VACUUM orders_pii RETAIN 0 HOURS")


def unreadable(read):
    try:
        read()
        return False
    except Exception as e:  # noqa: BLE001
        return "FILE_NOT_EXIST" in str(e) or "does not exist" in str(e).lower() or "DELTA_" in str(e)


assert unreadable(lambda: sql("SELECT * FROM orders_pii VERSION AS OF 1").collect())  # after VACUUM the old version is gone
assert unreadable(lambda: spark.read.format("delta").option("readChangeFeed", "true").option("startingVersion", 2).table("orders_pii").collect())
assert sql("SELECT total FROM spend_total").collect()[0].total == Decimal("100.00")  # ...but VACUUM never touches a derived table
sql("INSERT OVERWRITE spend_total SELECT sum(amount) FROM orders_pii")  # only a recompute removes c1 from it
assert sql("SELECT total FROM spend_total").collect()[0].total == Decimal("35.00")

# ---- 5. two objectives, computed (the objectives are illustrative; the data is Chapter 5's) ----------------------------------
typed = t.apply_rules(t.type_orders(raw), stores)
passed, total = typed.filter("reason IS NULL").count(), typed.count()
assert (passed, total) == (8, 11) and round(100 * passed / total, 1) == 72.7  # against an illustrative 95% objective: breached
newest = typed.agg(F.max("event_ts")).collect()[0][0]
now = spark.sql("SELECT CAST('2026-10-01 10:20:00' AS TIMESTAMP) AS now").collect()[0].now  # a fixed clock, so the result is repeatable
assert int((now - newest).total_seconds() // 60) == 30
typed.createOrReplaceTempView("typed_events")
assert sql("""SELECT timestampdiff(MINUTE, max(event_ts), TIMESTAMP '2026-10-01 10:20:00') AS lag FROM typed_events""").collect()[0].lag == 30  # against an illustrative 15-minute objective: breached

# ---- 6. a HYPOTHETICAL lag-versus-retention timeline (assumed numbers) ------------------------------------------------------------
SOURCE_RETENTION_DAYS, FAILED_ON_DAY, NOTICED_ON_DAY = 7, 0, 5
backlog_days = NOTICED_ON_DAY - FAILED_ON_DAY
assert (backlog_days, SOURCE_RETENTION_DAYS - backlog_days) == (5, 2)  # five days behind, two days of replay window left

print("OK: Chapter 10 local facts reproduced (tests, bug diff, wheel, deletion obligations, objectives; bundles/deploy/secrets documented, not run)")
