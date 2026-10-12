"""Reproduces and asserts every output quoted in Chapter 3 (course `delta-tables`).

Local PySpark 4.0.1 + Delta Lake 4.0.0 on local[2] — NOT a Databricks Runtime. File counts, error wording
and defaults can differ on the platform. Setup and run as in ch01_foundations.py. Takes about a minute
(the write-conflict demo deliberately holds one writer open for a few seconds).

Writes throwaway tables under ./.verify-warehouse-ch03 (git-ignored).
"""
import glob
import json
import os
import shutil
import threading
import time
from decimal import Decimal

from delta import configure_spark_with_delta_pip
from pyspark.sql import SparkSession, functions as F

WH = os.path.abspath(".verify-warehouse-ch03")
shutil.rmtree(WH, ignore_errors=True)
builder = (
    SparkSession.builder.master("local[2]").appName("ch03")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .config("spark.sql.warehouse.dir", WH)
    .config("spark.ui.enabled", "false")
    .config("spark.sql.shuffle.partitions", "2")
    .config("spark.databricks.delta.retentionDurationCheck.enabled", "false")  # needed only for the VACUUM demo
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()
spark.sparkContext.setLogLevel("ERROR")
sql = spark.sql


def history(t):
    return [(r.version, r.operation) for r in sql(f"DESCRIBE HISTORY {t}").orderBy("version").collect()]


def rows(q):
    return [tuple(r) for r in sql(q).collect()]


def fails(q, *needles):
    """Run `q`, require it to raise, and require every needle in the message. Returns the message."""
    try:
        sql(q).collect()
    except Exception as e:  # noqa: BLE001 - any engine error is the point
        msg = str(e).replace("\n", " ")
        for n in needles:
            assert n in msg, (n, msg[:400])
        return msg
    raise AssertionError("expected failure: " + q)


# ---- §3.1 / §3.4 / §3.5 the main timeline: versions 0..5, then a restore -----------------------------
sql("CREATE TABLE orders (order_id STRING NOT NULL, store_id INT, amount DECIMAL(10,2), status STRING) USING delta")
sql("""INSERT INTO orders VALUES ('o1',7,40.00,'COMPLETED'),('o2',7,25.00,'COMPLETED'),('o3',9,60.00,'CANCELLED'),
       ('o4',9,15.00,'COMPLETED'),('o5',12,80.00,'COMPLETED'),('o6',7,10.00,'PENDING')""")
sql("INSERT INTO orders VALUES ('o8',12,20.00,'PENDING')")
sql("UPDATE orders SET status='COMPLETED' WHERE order_id='o6'")
sql("DELETE FROM orders WHERE order_id='o3'")
sql("""MERGE INTO orders t
       USING (SELECT * FROM VALUES ('o8',12,20.00,'COMPLETED'),('o9',9,45.00,'COMPLETED')
              AS s(order_id,store_id,amount,status)) s
       ON t.order_id = s.order_id
       WHEN MATCHED THEN UPDATE SET status = s.status
       WHEN NOT MATCHED THEN INSERT *""")
assert history("orders") == [(0, "CREATE TABLE"), (1, "WRITE"), (2, "WRITE"), (3, "UPDATE"), (4, "DELETE"), (5, "MERGE")]
counts = [sql(f"SELECT count(*) c FROM orders VERSION AS OF {v}").collect()[0].c for v in range(6)]
assert counts == [0, 6, 7, 7, 6, 7], counts
metrics = {r.version: r.operationMetrics for r in sql("DESCRIBE HISTORY orders").collect()}
assert metrics[3]["numUpdatedRows"] == "1" and metrics[4]["numDeletedRows"] == "1"
assert metrics[5]["numTargetRowsInserted"] == "1" and metrics[5]["numTargetRowsUpdated"] == "1"
log = {}
for f in sorted(glob.glob(os.path.join(WH, "orders", "_delta_log", "*.json"))):
    with open(f) as fh:
        log[int(os.path.basename(f)[:20])] = [next(iter(json.loads(line))) for line in fh]
assert log == {
    0: ["commitInfo", "metaData", "protocol"], 1: ["commitInfo", "add", "add"], 2: ["commitInfo", "add"],
    3: ["commitInfo", "add", "remove"], 4: ["commitInfo", "remove", "add"], 5: ["commitInfo", "add", "remove"],
}, log
assert rows("SELECT order_id, status FROM orders ORDER BY order_id") == [
    ("o1", "COMPLETED"), ("o2", "COMPLETED"), ("o4", "COMPLETED"), ("o5", "COMPLETED"),
    ("o6", "COMPLETED"), ("o8", "COMPLETED"), ("o9", "COMPLETED")]
assert rows("SELECT status FROM orders VERSION AS OF 2 WHERE order_id='o6'") == [("PENDING",)]
# MERGE match semantics: two source rows for one target row is an error, not a silent pick.
msg = fails("""MERGE INTO orders t USING (SELECT * FROM VALUES ('o8','COMPLETED'),('o8','CANCELLED') AS s(order_id,status)) s
               ON t.order_id = s.order_id WHEN MATCHED THEN UPDATE SET status = s.status""", "MULTIPLE_SOURCE_ROW")
sql("RESTORE TABLE orders TO VERSION AS OF 4")  # the MERGE at version 5 is undone by a NEW version 6
assert history("orders")[-2:] == [(5, "MERGE"), (6, "RESTORE")]
assert sql("SELECT count(*) c FROM orders").collect()[0].c == 6
assert sql("SELECT count(*) c FROM orders VERSION AS OF 5").collect()[0].c == 7  # time travel still reads v5

# ---- §3.3 schema enforcement, evolution, a contract ---------------------------------------------------
sql("CREATE TABLE orders_c (order_id STRING NOT NULL, store_id INT, amount DECIMAL(10,2), status STRING) USING delta")
sql("INSERT INTO orders_c VALUES ('o1',7,40.00,'COMPLETED')")
assert "mergeSchema" in fails("INSERT INTO orders_c VALUES ('x',1,1.00,'NEW','web')", "schema mismatch")
fails("INSERT INTO orders_c VALUES ('x','abc',1.00,'NEW')", "CAST_INVALID_INPUT")
fails("INSERT INTO orders_c VALUES (NULL,7,5.00,'NEW')", "NOT NULL constraint violated", "order_id")
sql("ALTER TABLE orders_c ADD CONSTRAINT positive_amount CHECK (amount > 0)")
fails("INSERT INTO orders_c VALUES ('o10',7,-5.00,'NEW')", "positive_amount", "-5.00")
new = (spark.createDataFrame([("o10", 7, "5.00", "PENDING", "web")], "order_id string, store_id int, amount string, status string, channel string")
       .withColumn("amount", F.col("amount").cast("decimal(10,2)")))
try:
    new.write.format("delta").mode("append").saveAsTable("orders_c")
    raise AssertionError("append with a new column must fail without mergeSchema")
except AssertionError:
    raise
except Exception as e:  # noqa: BLE001
    assert "schema mismatch" in str(e)
new.write.format("delta").mode("append").option("mergeSchema", "true").saveAsTable("orders_c")
assert [c for c, _ in spark.table("orders_c").dtypes] == ["order_id", "store_id", "amount", "status", "channel"]
assert rows("SELECT order_id, channel FROM orders_c ORDER BY order_id") == [("o1", None), ("o10", "web")]

# ---- §3.2 concurrent writers --------------------------------------------------------------------------
sql("CREATE TABLE orders_race (order_id STRING, amount DECIMAL(10,2), status STRING) USING delta")
sql("INSERT INTO orders_race VALUES ('o1',40.00,'COMPLETED'),('o2',25.00,'COMPLETED')")
spark.udf.register("slow", lambda x: (time.sleep(2), x)[1], "string")
outcome = {}


def writer_a():  # reads the snapshot, then takes its time before committing
    try:
        sql("UPDATE orders_race SET status='SHIPPED' WHERE slow(order_id)='o1'")
        outcome["A"] = "committed"
    except Exception as e:  # noqa: BLE001
        outcome["A"] = str(e).replace("\n", " ")


def writer_b():  # starts later but commits first
    time.sleep(1)
    sql("UPDATE orders_race SET amount = 41.00 WHERE order_id='o1'")
    outcome["B"] = "committed"


ta, tb = threading.Thread(target=writer_a), threading.Thread(target=writer_b)
ta.start(); tb.start(); ta.join(); tb.join()
assert outcome["B"] == "committed" and "ConcurrentAppendException" in outcome["A"], outcome
assert rows("SELECT order_id, amount, status FROM orders_race WHERE order_id='o1'") == [("o1", Decimal("41.00"), "COMPLETED")]
assert history("orders_race") == [(0, "CREATE TABLE"), (1, "WRITE"), (2, "UPDATE")]
ap = {}


def appender(i):
    sql(f"INSERT INTO orders_race VALUES ('c{i}',1.00,'PENDING')")
    ap[i] = "ok"


ts = [threading.Thread(target=appender, args=(i,)) for i in (1, 2)]
[t.start() for t in ts]; [t.join() for t in ts]
assert ap == {1: "ok", 2: "ok"}  # concurrent blind appends do not conflict

# ---- §3.6 retention and VACUUM ------------------------------------------------------------------------
sql("CREATE TABLE ret (id INT) USING delta")
sql("INSERT INTO ret VALUES (1),(2)"); sql("INSERT INTO ret VALUES (3)"); sql("DELETE FROM ret WHERE id=1")
ids = lambda v: sorted(r.id for r in sql(f"SELECT * FROM ret VERSION AS OF {v}").collect())  # noqa: E731
assert [ids(1), ids(2), ids(3)] == [[1, 2], [1, 2, 3], [2, 3]]
assert sql("VACUUM ret RETAIN 168 HOURS DRY RUN").collect() == []  # nothing is old enough yet
assert len(sql("VACUUM ret RETAIN 0 HOURS DRY RUN").collect()) == 2
sql("VACUUM ret RETAIN 0 HOURS")
assert ids(3) == [2, 3]
for v in (1, 2):
    try:
        ids(v)
        raise AssertionError("version %d should be unreadable after VACUUM" % v)
    except AssertionError:
        raise
    except Exception as e:  # noqa: BLE001
        assert "FILE_NOT_EXIST" in str(e), str(e)[:300]
spark.conf.set("spark.databricks.delta.retentionDurationCheck.enabled", "true")
fails("VACUUM ret RETAIN 0 HOURS", "low retention period")
spark.conf.set("spark.databricks.delta.retentionDurationCheck.enabled", "false")

# ---- §3.7 change data feed ----------------------------------------------------------------------------
sql("CREATE TABLE feed (order_id STRING, status STRING) USING delta TBLPROPERTIES (delta.enableChangeDataFeed = true)")
sql("INSERT INTO feed VALUES ('o1','PENDING'),('o2','PENDING')")
sql("UPDATE feed SET status='COMPLETED' WHERE order_id='o1'")
sql("DELETE FROM feed WHERE order_id='o2'")
changes = [tuple(r) for r in (spark.read.format("delta").option("readChangeFeed", "true").option("startingVersion", 1).table("feed")
           .select("order_id", "status", "_change_type", "_commit_version").orderBy("_commit_version", "order_id", "_change_type").collect())]
assert changes == [
    ("o1", "PENDING", "insert", 1), ("o2", "PENDING", "insert", 1),
    ("o1", "COMPLETED", "update_postimage", 2), ("o1", "PENDING", "update_preimage", 2),
    ("o2", "PENDING", "delete", 3),
], changes
assert "_change_data" in os.listdir(os.path.join(WH, "feed"))
sql("CREATE TABLE late (id INT) USING delta"); sql("INSERT INTO late VALUES (1)")
sql("ALTER TABLE late SET TBLPROPERTIES (delta.enableChangeDataFeed = true)")
sql("INSERT INTO late VALUES (2)")
try:
    spark.read.format("delta").option("readChangeFeed", "true").option("startingVersion", 1).table("late").collect()
    raise AssertionError("reading the feed from before it was enabled must fail")
except AssertionError:
    raise
except Exception as e:  # noqa: BLE001
    assert "DELTA_MISSING_CHANGE_DATA" in str(e)
assert [tuple(r) for r in spark.read.format("delta").option("readChangeFeed", "true").option("startingVersion", 3).table("late")
        .select("id", "_change_type", "_commit_version").collect()] == [(2, "insert", 3)]

# ---- §3.8 protocol and table features -----------------------------------------------------------------
def proto(t):
    d = sql(f"DESCRIBE DETAIL {t}").collect()[0]
    return d.minReaderVersion, d.minWriterVersion, sorted(d.tableFeatures)


assert proto("ret") == (1, 2, ["appendOnly", "invariants"])
assert proto("feed") == (1, 7, ["appendOnly", "changeDataFeed", "invariants"])
assert proto("orders_c") == (1, 3, ["appendOnly", "checkConstraints", "invariants"])

print("OK: Chapter 3 facts reproduced (local PySpark 4.0.1 + Delta 4.0.0; platform behaviour and wording may differ)")
