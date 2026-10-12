"""Reproduces and asserts every output quoted in Chapter 6 (course `streaming-cdc`).

Local PySpark 4.0.1 + Delta Lake 4.0.0 on local[2] — NOT a Databricks Runtime. Streams read JSON files with
`maxFilesPerTrigger=1` and `availableNow`, so each file is one micro-batch; file modification times are set
explicitly because Spark reads files oldest-first and equal times make the order arbitrary. A progress
listener records each batch's watermark and state size. The CDC, SCD and change-feed parts are plain Delta.
AUTO CDC (declarative pipelines) and any Databricks-provided automatic change feed are NOT run here.

Takes a few minutes. Writes under ./.verify-warehouse-ch06 (git-ignored).
"""
import json
import os
import shutil
import time
from decimal import Decimal

from delta import configure_spark_with_delta_pip
from delta.tables import DeltaTable
from pyspark.sql import SparkSession, Window, functions as F
from pyspark.sql.streaming import StreamingQueryListener

ROOT = os.path.abspath(".verify-warehouse-ch06")
shutil.rmtree(ROOT, ignore_errors=True)
os.makedirs(ROOT)
builder = (
    SparkSession.builder.master("local[2]").appName("ch06")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .config("spark.sql.warehouse.dir", os.path.join(ROOT, "wh"))
    .config("spark.ui.enabled", "false")
    .config("spark.sql.shuffle.partitions", "2")
    .config("spark.sql.session.timeZone", "UTC")
    .config("spark.databricks.delta.retentionDurationCheck.enabled", "false")  # only for the VACUUM demo
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()
spark.sparkContext.setLogLevel("ERROR")
sql = spark.sql
D = Decimal

# ---- the streaming input: ten order events in four files; o4 is resent, o10 and o12 arrive late ------------
FILES = {
    "f1": [("o1", 7, "40.00", "2026-10-01T09:01:00"), ("o2", 7, "25.00", "2026-10-01T09:04:00"), ("o4", 9, "15.00", "2026-10-01T09:14:00")],
    "f2": [("o5", 12, "80.00", "2026-10-01T09:17:00"), ("o6", 7, "10.00", "2026-10-01T09:23:00"), ("o4", 9, "15.00", "2026-10-01T09:14:00")],
    "f3": [("o10", 7, "30.00", "2026-10-01T09:06:00"), ("o11", 9, "20.00", "2026-10-01T09:31:00")],
    "f4": [("o12", 12, "5.00", "2026-10-01T09:02:00"), ("o13", 7, "50.00", "2026-10-01T09:44:00")],
}
PAYMENTS = {
    "p1": [("o1", "2026-10-01T09:05:00"), ("o2", "2026-10-01T09:09:00")],
    "p2": [("o4", "2026-10-01T09:16:00"), ("o5", "2026-10-01T09:20:00")],
    "p3": [("o10", "2026-10-01T09:30:00"), ("o11", "2026-10-01T09:40:00")],
    "p4": [("o13", "2026-10-01T09:50:00")],
}


def write_files(directory, files, keys, only=None):
    os.makedirs(directory, exist_ok=True)
    for i, (name, rows) in enumerate(files.items()):
        if only is not None and i not in only:
            continue
        path = os.path.join(directory, f"{i + 1}-{name}.json")
        with open(path, "w") as f:
            for r in rows:
                f.write(json.dumps(dict(zip(keys, r))) + "\n")
        os.utime(path, (1_700_000_000 + i * 60,) * 2)


IN = os.path.join(ROOT, "orders_in")
PIN = os.path.join(ROOT, "payments_in")
write_files(IN, FILES, ["order_id", "store_id", "amount", "event_ts"])
write_files(PIN, PAYMENTS, ["p_order", "pay_ts"])
SCHEMA = "order_id string, store_id int, amount decimal(10,2), event_ts timestamp"
PSCHEMA = "p_order string, pay_ts timestamp"

progress = []


class Collect(StreamingQueryListener):
    def onQueryStarted(self, event):
        pass

    def onQueryProgress(self, event):
        p = event.progress
        progress.append({
            "batch": p.batchId, "rows": p.numInputRows,
            "watermark": (p.eventTime or {}).get("watermark"),
            "state": [(s.numRowsTotal, s.numRowsDroppedByWatermark) for s in p.stateOperators],
        })

    def onQueryIdle(self, event):
        pass

    def onQueryTerminated(self, event):
        pass


spark.streams.addListener(Collect())


def settle(expected):
    """Listener events arrive asynchronously; wait for `expected` progress events (or give up after 30 s)."""
    deadline = time.time() + 30
    while len(progress) < expected and time.time() < deadline:
        time.sleep(0.3)
    time.sleep(0.5)


def run(df, ckpt, collect, expected_batches, mode="update"):
    """Run `df` once with availableNow; return (per-batch results, progress). A failure returns the message."""
    progress.clear()
    results = []
    q = (df.writeStream.outputMode(mode).option("checkpointLocation", os.path.join(ROOT, ckpt)).trigger(availableNow=True)
         .foreachBatch(lambda b, i: results.append((i, collect(b)))).start())
    try:
        q.awaitTermination()
    except Exception as e:  # noqa: BLE001
        return "ERR " + str(e).replace("\n", " ")
    settle(expected_batches)
    return results, list(progress)


def source(directory=IN, schema=SCHEMA):
    return spark.readStream.schema(schema).option("maxFilesPerTrigger", 1).json(directory)


def windows(b):
    return sorted((r.window.start.strftime("%H:%M"), str(r.sales)) for r in b.collect())


def windowed(directory=IN, watermark=True, keys=(), size="10 minutes"):
    s = source(directory)
    if watermark:
        s = s.withWatermark("event_ts", "10 minutes")
    return s.groupBy(F.window("event_ts", size), *keys).agg(F.sum("amount").alias("sales"))


# ---- §6.2 event time, late data and watermarks ---------------------------------------------------------------
res, prog = run(windowed(), "ck_append", windows, 5, mode="append")
assert [r for _, r in res] == [[], [], [("09:00", "95.00")], [("09:10", "110.00")], [("09:20", "10.00")]], res
wm = [p["watermark"] for p in sorted(prog, key=lambda p: p["batch"])]
assert wm == ["1970-01-01T00:00:00.000Z", "2026-10-01T09:04:00.000Z", "2026-10-01T09:13:00.000Z",
              "2026-10-01T09:21:00.000Z", "2026-10-01T09:34:00.000Z"], wm
by_batch = {p["batch"]: p for p in prog}
assert by_batch[3]["state"][0][1] == 1  # o12 (event time 09:02) was dropped as too late
assert by_batch[4]["rows"] == 0  # the last batch had no data: it ran only to advance the watermark
res, _ = run(windowed(), "ck_update", windows, 5)
assert dict(res)[2] == [("09:00", "95.00"), ("09:30", "20.00")]  # the late o10 (09:06) was still counted in window 09:00
res, prog = run(windowed(watermark=False), "ck_nowm", windows, 4)
assert dict(res)[3] == [("09:00", "100.00"), ("09:40", "50.00")]  # without a watermark o12 is counted too: 95.00 -> 100.00
assert [p["state"][0][0] for p in sorted(prog, key=lambda p: p["batch"])] == [2, 3, 4, 5]  # and state only grows

# ---- §6.3 state size: aggregation and deduplication ------------------------------------------------------------
_, prog = run(windowed(), "ck_state_wm", windows, 5)
assert [p["state"][0][0] for p in sorted(prog, key=lambda p: p["batch"])] == [2, 3, 3, 3, 2]  # windows leave state
dedup_nowm = source().dropDuplicates(["order_id", "event_ts"]).groupBy().count()
res, prog = run(dedup_nowm, "ck_dedup_nowm", lambda b: [r[0] for r in b.collect()], 4)
assert [p["state"][-1][0] for p in sorted(prog, key=lambda p: p["batch"])] == [3, 5, 7, 9]  # one state row per key, forever
assert dict(res)[3] == [9]  # 10 rows in, o4's resend collapsed
dedup_wm = source().withWatermark("event_ts", "10 minutes").dropDuplicates(["order_id", "event_ts"]).groupBy().count()
res, prog = run(dedup_wm, "ck_dedup_wm", lambda b: [r[0] for r in b.collect()], 5)
assert [p["state"][-1][0] for p in sorted(prog, key=lambda p: p["batch"])] == [3, 3, 4, 3, 1]  # expiry keeps it bounded
assert dict(res)[4] == [8]  # 9 distinct, minus o12 dropped as late

# ---- §6.4 streaming joins ---------------------------------------------------------------------------------------
cond = F.expr("p_order = order_id AND pay_ts >= event_ts AND pay_ts <= event_ts + interval 15 minutes")


def joined(how):
    o = source().withWatermark("event_ts", "10 minutes")
    p = source(PIN, PSCHEMA).withWatermark("pay_ts", "10 minutes")
    return o.join(p, cond, how).select("order_id", "amount", "pay_ts")


def pairs(b):
    return sorted((r.order_id, str(r.amount), None if r.pay_ts is None else r.pay_ts.strftime("%H:%M")) for r in b.collect())


res, prog = run(joined("inner"), "ck_join_inner", pairs, 5, mode="append")
out = dict(res)
assert out[0] == [("o1", "40.00", "09:05"), ("o2", "25.00", "09:09")]
assert out[1] == [("o4", "15.00", "09:16"), ("o4", "15.00", "09:16"), ("o5", "80.00", "09:20")]  # the resent o4 matches twice
assert out[2] == [("o11", "20.00", "09:40")] and out[3] == [("o13", "50.00", "09:50")] and out[4] == []
assert not any(r[0] == "o10" for rows_ in out.values() for r in rows_)  # o10's payment came 24 min later: no match
res, _ = run(joined("leftOuter"), "ck_join_outer", pairs, 5, mode="append")
assert dict(res)[4] == [("o10", "30.00", None)]  # the unmatched order appears only once the watermark has passed
stores = spark.createDataFrame([(7, "Leeds"), (9, "York"), (12, "Hull")], "store_id int, name string")
static_out = []
q = (source().join(stores, "store_id", "left").groupBy("name").agg(F.count("*").alias("n")).writeStream.outputMode("complete")
     .option("checkpointLocation", os.path.join(ROOT, "ck_static")).trigger(availableNow=True)
     .foreachBatch(lambda b, i: static_out.append((i, sorted(tuple(r) for r in b.collect())))).start())
q.awaitTermination()
assert static_out[-1][1] == [("Hull", 2), ("Leeds", 5), ("York", 3)]  # stream-static join: no stream state, reference read fresh

# ---- §6.5 checkpoints, restarts and query changes -----------------------------------------------------------------
first_two = os.path.join(ROOT, "grow")
write_files(first_two, FILES, ["order_id", "store_id", "amount", "event_ts"], only={0, 1})
res, _ = run(windowed(first_two), "ck_restart", windows, 3, )
assert [i for i, _ in res] == [0, 1, 2]
write_files(first_two, FILES, ["order_id", "store_id", "amount", "event_ts"])  # files 3 and 4 arrive while the query is stopped
res, _ = run(windowed(first_two), "ck_restart", windows, 3)
assert [i for i, _ in res] == [3, 4, 5]  # resumed: batches continue, nothing re-read
assert dict(res)[3] == [("09:30", "20.00")]


def with_changes(ckpt, build):
    d = os.path.join(ROOT, "in_" + ckpt)
    write_files(d, FILES, ["order_id", "store_id", "amount", "event_ts"], only={0, 1})
    run(windowed(d), ckpt, windows, 3)
    write_files(d, FILES, ["order_id", "store_id", "amount", "event_ts"])
    return run(build(d), ckpt, windows, 3)


ok = with_changes("ck_chg_filter", lambda d: source(d).filter("amount > 6").withWatermark("event_ts", "10 minutes")
                  .groupBy(F.window("event_ts", "10 minutes")).agg(F.sum("amount").alias("sales")))
assert not isinstance(ok, str) and not isinstance(ok[0], str), ok  # an extra stateless filter: accepted
ok = with_changes("ck_chg_window", lambda d: windowed(d, size="5 minutes"))
assert not isinstance(ok[0], str)  # a new window size: ALSO accepted, with no check that the old state still means the same
bad = with_changes("ck_chg_keys", lambda d: windowed(d, keys=("store_id",)))
assert isinstance(bad, str) and "STATE_STORE_KEY_SCHEMA_NOT_COMPATIBLE" in bad, bad  # a new grouping key: refused

# ---- §6.6 sink effects: replaying a batch -------------------------------------------------------------------------
EMPTY = "order_id string, event_ts timestamp, amount decimal(10,2)"
spark.createDataFrame([], EMPTY).write.format("delta").save(os.path.join(ROOT, "sink_append"))
spark.createDataFrame([], EMPTY).write.format("delta").save(os.path.join(ROOT, "sink_merge"))
crash = {"armed": True}


def write_both(batch_df, batch_id):
    rows_ = batch_df.select("order_id", "event_ts", "amount")
    rows_.write.format("delta").mode("append").save(os.path.join(ROOT, "sink_append"))
    (DeltaTable.forPath(spark, os.path.join(ROOT, "sink_merge")).alias("t")
     .merge(rows_.dropDuplicates(["order_id", "event_ts"]).alias("s"), "t.order_id = s.order_id AND t.event_ts = s.event_ts")
     .whenNotMatchedInsertAll().execute())
    if batch_id == 2 and crash["armed"]:
        crash["armed"] = False
        raise RuntimeError("simulated crash after writing batch 2 and before its commit")


def go():
    q = (source().writeStream.foreachBatch(write_both).option("checkpointLocation", os.path.join(ROOT, "ck_replay"))
         .trigger(availableNow=True).start())
    try:
        q.awaitTermination()
        return "ok"
    except Exception:  # noqa: BLE001
        return "failed"


count = lambda name: spark.read.format("delta").load(os.path.join(ROOT, name)).count()  # noqa: E731
assert go() == "failed"
assert (count("sink_append"), count("sink_merge")) == (8, 7)  # batches 0-2 were written before the crash
assert go() == "ok"  # batch 2 is replayed from the checkpoint
assert (count("sink_append"), count("sink_merge")) == (12, 9)  # 10 source rows; the append sink holds 2 replayed copies

# ---- §6.7 source CDC: keys, operations, sequence, deletes ------------------------------------------------------------
CDC_SCHEMA = "order_id string, op string, seq int, store_id int, amount decimal(10,2), status string"
BATCHES = [
    [("o1", "I", 1, 7, D("40.00"), "PENDING"), ("o2", "I", 1, 7, D("25.00"), "PENDING"), ("o3", "I", 1, 9, D("60.00"), "PENDING")],
    [("o1", "U", 3, 7, D("45.00"), "COMPLETED"), ("o2", "U", 2, 7, D("25.00"), "COMPLETED"), ("o3", "D", 2, 9, D("60.00"), "PENDING")],
    [("o1", "U", 2, 7, D("45.00"), "PENDING"), ("o3", "I", 1, 9, D("60.00"), "PENDING")],  # late, out of order
]


def batch_df(i):
    return spark.createDataFrame(BATCHES[i], CDC_SCHEMA)


# naive: apply each batch in arrival order, hard deletes, no sequence check
sql("CREATE TABLE naive (order_id STRING, store_id INT, amount DECIMAL(10,2), status STRING) USING delta")
for i in range(3):
    batch_df(i).createOrReplaceTempView("b")
    sql("""MERGE INTO naive t USING b s ON t.order_id = s.order_id
           WHEN MATCHED AND s.op = 'D' THEN DELETE
           WHEN MATCHED THEN UPDATE SET store_id = s.store_id, amount = s.amount, status = s.status
           WHEN NOT MATCHED AND s.op != 'D' THEN INSERT (order_id, store_id, amount, status) VALUES (s.order_id, s.store_id, s.amount, s.status)""")
naive = [tuple(r) for r in sql("SELECT * FROM naive ORDER BY order_id").collect()]
assert naive == [("o1", 7, D("45.00"), "PENDING"), ("o2", 7, D("25.00"), "COMPLETED"), ("o3", 9, D("60.00"), "PENDING")], naive
# o1 went back to PENDING (an older event arrived last); o3, deleted in batch 2, came back from a late insert.

SEQ_DDL = """CREATE TABLE {name} (order_id STRING, store_id INT, amount DECIMAL(10,2), status STRING, seq INT, is_deleted BOOLEAN)
             USING delta TBLPROPERTIES (delta.enableChangeDataFeed = {cdf})"""
SEQ_MERGE = """MERGE INTO {name} t USING b s ON t.order_id = s.order_id
               WHEN MATCHED AND s.seq > t.seq THEN UPDATE SET store_id = s.store_id, amount = s.amount, status = s.status,
                    seq = s.seq, is_deleted = (s.op = 'D')
               WHEN NOT MATCHED THEN INSERT (order_id, store_id, amount, status, seq, is_deleted)
                    VALUES (s.order_id, s.store_id, s.amount, s.status, s.seq, s.op = 'D')"""


def apply_batches(name, order=(0, 1, 2)):
    for i in order:
        batch_df(i).createOrReplaceTempView("b")
        sql(SEQ_MERGE.format(name=name))


sql(SEQ_DDL.format(name="sequenced", cdf="true"))
apply_batches("sequenced")
state = [tuple(r) for r in sql("SELECT order_id, amount, status, seq, is_deleted FROM sequenced ORDER BY order_id").collect()]
assert state == [("o1", D("45.00"), "COMPLETED", 3, False), ("o2", D("25.00"), "COMPLETED", 2, False), ("o3", D("60.00"), "PENDING", 2, True)], state
assert [r.order_id for r in sql("SELECT order_id FROM sequenced WHERE NOT is_deleted ORDER BY order_id").collect()] == ["o1", "o2"]
# replaying everything again changes nothing: the sequence guard makes the apply idempotent
apply_batches("sequenced")
assert [tuple(r) for r in sql("SELECT order_id, amount, status, seq, is_deleted FROM sequenced ORDER BY order_id").collect()] == state
# arrival order does not matter either
sql(SEQ_DDL.format(name="reordered", cdf="false"))
apply_batches("reordered", order=(2, 1, 0))
assert [tuple(r) for r in sql("SELECT order_id, amount, status, seq, is_deleted FROM reordered ORDER BY order_id").collect()] == state

# ---- §6.8 SCD1 and SCD2 ------------------------------------------------------------------------------------------------
all_events = batch_df(0).unionByName(batch_df(1)).unionByName(batch_df(2)).dropDuplicates(["order_id", "op", "seq"])
assert all_events.count() == 7  # 8 source records, one an exact repeat (o3 insert seq 1)
all_events.createOrReplaceTempView("events")
scd1 = [tuple(r) for r in sql("""SELECT order_id, amount, status FROM (
        SELECT *, row_number() OVER (PARTITION BY order_id ORDER BY seq DESC) rn FROM events) WHERE rn = 1 AND op != 'D'
        ORDER BY order_id""").collect()]
assert scd1 == [("o1", D("45.00"), "COMPLETED"), ("o2", D("25.00"), "COMPLETED")], scd1
# History: order every event of a key by sequence; each version ends where the next event begins. A delete
# closes the previous version and is not itself a version.
history = [tuple(r) for r in sql("""SELECT order_id, amount, status, seq AS start_seq, end_seq FROM (
          SELECT *, lead(seq) OVER (PARTITION BY order_id ORDER BY seq) AS end_seq FROM events)
        WHERE op != 'D' ORDER BY order_id, seq""").collect()]
assert [(r[0], r[2], r[3], r[4]) for r in history] == [
    ("o1", "PENDING", 1, 2), ("o1", "PENDING", 2, 3), ("o1", "COMPLETED", 3, None),
    ("o2", "PENDING", 1, 2), ("o2", "COMPLETED", 2, None),
    ("o3", "PENDING", 1, 2),
], history  # o3's only version closes at its delete (seq 2): no current row

# ---- §6.9 table change feed versus source CDC ---------------------------------------------------------------------------
cdf = (spark.read.format("delta").option("readChangeFeed", "true").option("startingVersion", 1).table("sequenced")
       .select("order_id", "_change_type", "_commit_version").orderBy("_commit_version", "order_id", "_change_type").collect())
per_version = {}
for r in cdf:
    per_version.setdefault(r._commit_version, []).append((r.order_id, r._change_type))
versions = sorted(per_version)
assert per_version[versions[0]] == [("o1", "insert"), ("o2", "insert"), ("o3", "insert")]
assert len(per_version[versions[1]]) == 6  # three updates, each a before and an after image
assert len(versions) == 2 and sum(len(v) for v in per_version.values()) == 9  # replays and late events left no trace at all
assert sum(len(b) for b in BATCHES) == 8  # ...while the source sent 8 records

# ---- §6.10 unavailable history ------------------------------------------------------------------------------------------
sql("VACUUM sequenced RETAIN 0 HOURS")
try:
    spark.read.format("delta").option("readChangeFeed", "true").option("startingVersion", 1).table("sequenced") \
        .select("order_id", "_change_type").collect()
    unavailable = False
except Exception as e:  # noqa: BLE001
    unavailable = "FILE_NOT_EXIST" in str(e) or "does not exist" in str(e).lower()
assert unavailable, "the change feed for old versions should be unreadable after VACUUM"
assert [tuple(r) for r in sql("SELECT order_id, amount, status, seq, is_deleted FROM sequenced ORDER BY order_id").collect()] == state

print("OK: Chapter 6 facts reproduced (local PySpark 4.0.1 + Delta 4.0.0; AUTO CDC and automatic feeds are not run)")
