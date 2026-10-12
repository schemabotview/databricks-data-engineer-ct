"""A LOCAL MODEL of the Lakeflow Jobs semantics Chapter 8 (course `orchestration`) describes. It is NOT Databricks
Jobs and proves nothing about the platform. It implements, in a few lines, what the docs state:

  * a task runs when its upstream tasks allow it (default "all succeeded"); a task whose upstream failed is
    SKIPPED; a condition task decides whether a dependent runs (otherwise it is EXCLUDED);
  * "run if" conditions such as "at least one failed" let a task run on a failure path;
  * a task can be retried; a REPAIR run re-runs the unsuccessful tasks (failed or skipped) and keeps the
    results of the ones that succeeded; a full rerun starts every task again;
  * the platform does NOT make tasks idempotent: a task that wrote output and then failed duplicates it when
    run again unless the write is an overwrite or a merge.

The business effects (bronze, silver, a published table) are real Delta tables on local PySpark 4.0.1 +
Delta 4.0.0, so the row counts quoted in the slides are real counts of what these task bodies did. Run:
  .venv/bin/python scripts/verify/ch08_orchestration_model.py
Writes under ./.verify-warehouse-ch08 (git-ignored).
"""
import os
import shutil
from decimal import Decimal

from delta import configure_spark_with_delta_pip
from delta.tables import DeltaTable
from pyspark.sql import SparkSession, functions as F

ROOT = os.path.abspath(".verify-warehouse-ch08")
shutil.rmtree(ROOT, ignore_errors=True)
os.makedirs(ROOT)
builder = (
    SparkSession.builder.master("local[2]").appName("ch08")
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension")
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog")
    .config("spark.sql.warehouse.dir", os.path.join(ROOT, "wh"))
    .config("spark.ui.enabled", "false")
    .config("spark.sql.shuffle.partitions", "2")
)
spark = configure_spark_with_delta_pip(builder).getOrCreate()
spark.sparkContext.setLogLevel("ERROR")

# ---- the landing files: the same three CSVs as Chapter 4 (3 + 3 + 2 = 8 rows) --------------------------------
FILES = {
    "orders-a.csv": ["o1,7,40.00,COMPLETED", "o2,7,25.00,COMPLETED", "o3,9,60.00,CANCELLED"],
    "orders-b.csv": ["o4,9,15.00,COMPLETED", "o5,12,80.00,COMPLETED", "o6,7,10.00,PENDING"],
    "orders-c.csv": ["o4,9,15.00,COMPLETED", "o7,9,n/a,COMPLETED"],
}
TEXT = "order_id string, store_id string, amount string, status string"


def landing(name, names):
    path = os.path.join(ROOT, name, "landing")
    os.makedirs(path)
    for n in names:
        with open(os.path.join(path, n), "w") as f:
            f.write("order_id,store_id,amount,status\n" + "\n".join(FILES[n]) + "\n")
    return path


# ---- the model --------------------------------------------------------------------------------------------------
class Ctx:
    def __init__(self, scenario, params, files=("orders-a.csv", "orders-b.csv", "orders-c.csv"), idempotent=False, fail_once=()):
        self.dir = os.path.join(ROOT, scenario)
        os.makedirs(self.dir, exist_ok=True)
        self.landing = landing(scenario, files)
        self.params, self.idempotent = params, idempotent
        self.values = {}  # task values: {task_key: {name: value}}
        self.fail_once = set(fail_once)  # fail the first time this task body runs (a transient fault)
        self.fail_after_write_once = set()  # fail AFTER the task's write has been committed (e.g. a timeout)
        self.attempts = {}

    def path(self, name):
        return os.path.join(self.dir, name)


class Task:
    def __init__(self, key, fn, deps=(), run_if="ALL_SUCCESS", retries=0, condition=None):
        self.key, self.fn, self.deps, self.run_if, self.retries, self.condition = key, fn, list(deps), run_if, retries, condition


def run_job(tasks, ctx, prior=None):
    """Run `tasks` (in dependency order). With `prior` (a previous run's results) this is a REPAIR: tasks that
    already SUCCEEDED are kept, everything else is run again."""
    res = {k: dict(v) for k, v in (prior or {}).items()}
    for t in tasks:
        if prior and res[t.key]["state"] == "SUCCEEDED":
            continue
        states = {}
        for d in t.deps:
            key, want = d if isinstance(d, tuple) else (d, None)
            up = res[key]
            if want is not None and up["state"] == "SUCCEEDED" and up.get("outcome") != want:
                states[key] = "EXCLUDED"
            else:
                states[key] = up["state"]
        ran = states.values()
        if t.run_if == "ALL_SUCCESS":
            ok = all(s == "SUCCEEDED" for s in ran)
        elif t.run_if == "AT_LEAST_ONE_FAILED":
            ok = any(s == "FAILED" for s in ran)
        else:
            raise ValueError(t.run_if)
        if not ok:
            res[t.key] = {"state": "EXCLUDED" if "EXCLUDED" in ran and "FAILED" not in ran else "SKIPPED", "attempts": 0}
            continue
        for attempt in range(1, t.retries + 2):
            ctx.attempts[t.key] = ctx.attempts.get(t.key, 0) + 1
            try:
                out = t.fn(ctx)
                res[t.key] = {"state": "SUCCEEDED", "attempts": attempt}
                if t.condition:
                    res[t.key]["outcome"] = t.condition(ctx)
                break
            except RuntimeError as e:
                res[t.key] = {"state": "FAILED", "attempts": attempt, "error": str(e)}
    return res


states = lambda res: {k: v["state"] for k, v in res.items()}  # noqa: E731
read = lambda ctx, name: spark.read.format("delta").load(ctx.path(name))  # noqa: E731
count = lambda ctx, name: read(ctx, name).count()  # noqa: E731

# ---- the retail job: ingest -> transform -> validate -> publish, plus a row-count check and an alert -------------
EXPECTED_ROWS = 8


def t_ingest(ctx):
    raw = spark.read.option("header", True).schema(TEXT).csv(ctx.landing).select("*", F.col("_metadata.file_name").alias("source_file"))
    rows = raw.count()
    if ctx.idempotent and os.path.exists(ctx.path("bronze")):
        (DeltaTable.forPath(spark, ctx.path("bronze")).alias("t")
         .merge(raw.alias("s"), "t.source_file = s.source_file AND t.order_id = s.order_id")
         .whenNotMatchedInsertAll().execute())
    else:
        raw.write.format("delta").mode("append").save(ctx.path("bronze"))
    ctx.values["ingest"] = {"rows_read": rows}


def t_transform(ctx):
    if "transform" in ctx.fail_once:
        ctx.fail_once.discard("transform")
        raise RuntimeError("transient fault in transform")
    read(ctx, "bronze").createOrReplaceTempView("b")
    spark.sql("""SELECT DISTINCT order_id, CAST(store_id AS INT) store_id, CAST(amount AS DECIMAL(10,2)) amount, status
                 FROM b WHERE try_cast(amount AS DECIMAL(10,2)) IS NOT NULL""").write.format("delta").mode("overwrite").save(ctx.path("silver"))


def t_validate(ctx):
    if read(ctx, "silver").count() != 6:
        raise RuntimeError("silver should hold 6 orders")


def t_rows_ok(ctx):
    pass


def rows_ok_outcome(ctx):
    return ctx.values["ingest"]["rows_read"] >= int(ctx.params["expected_rows"])


def t_publish(ctx):
    total = read(ctx, "silver").filter("status = 'COMPLETED'").agg(F.sum("amount")).collect()[0][0]
    row = spark.createDataFrame([(ctx.params["run_date"], total)], "run_date string, total decimal(18,2)")
    target = ctx.path("published")
    if ctx.idempotent and os.path.exists(target):
        (DeltaTable.forPath(spark, target).alias("t").merge(row.alias("s"), "t.run_date = s.run_date")
         .whenMatchedUpdateAll().whenNotMatchedInsertAll().execute())
    else:
        row.write.format("delta").mode("append").save(target)
    if "publish" in ctx.fail_after_write_once:
        ctx.fail_after_write_once.discard("publish")
        raise RuntimeError("timed out after the write was committed")


def t_alert(ctx):
    ctx.values["alert"] = {"sent": True}


def job(publish_retries=0):
    return [
        Task("ingest", t_ingest),
        Task("transform", t_transform, deps=["ingest"]),
        Task("validate", t_validate, deps=["transform"]),
        Task("rows_ok", t_rows_ok, deps=["ingest"], condition=rows_ok_outcome),
        Task("publish", t_publish, deps=["validate", ("rows_ok", True)], retries=publish_retries),
        Task("alert", t_alert, deps=["transform"], run_if="AT_LEAST_ONE_FAILED"),
    ]


PARAMS = {"run_date": "2026-10-01", "expected_rows": "8"}

# ---- §8.5 a failed middle task: repair versus a full rerun ----------------------------------------------------
ctx = Ctx("repair", PARAMS, fail_once={"transform"})
first = run_job(job(), ctx)
assert states(first) == {"ingest": "SUCCEEDED", "transform": "FAILED", "validate": "SKIPPED", "rows_ok": "SUCCEEDED",
                         "publish": "SKIPPED", "alert": "SUCCEEDED"}, states(first)
assert count(ctx, "bronze") == 8 and not os.path.exists(ctx.path("silver"))
repaired = run_job(job(), ctx, prior=first)
assert all(v == "SUCCEEDED" for v in states(repaired).values()), states(repaired)
assert ctx.attempts["ingest"] == 1  # the repair did NOT run ingest again
assert (count(ctx, "bronze"), count(ctx, "silver"), count(ctx, "published")) == (8, 6, 1)
assert read(ctx, "published").collect()[0].total == Decimal("160.00")

ctx = Ctx("rerun_append", PARAMS, fail_once={"transform"})
run_job(job(), ctx)
rerun = run_job(job(), ctx)  # a full rerun: every task starts again
assert states(rerun) == {"ingest": "SUCCEEDED", "transform": "SUCCEEDED", "validate": "SUCCEEDED", "rows_ok": "SUCCEEDED",
                         "publish": "SUCCEEDED", "alert": "SKIPPED"}, states(rerun)  # nothing failed this time, so the alert has no cause to run
assert ctx.attempts["ingest"] == 2
assert count(ctx, "bronze") == 16  # ingest appended the same 8 rows a second time...
assert count(ctx, "silver") == 6 and count(ctx, "published") == 1  # ...and DISTINCT in transform hid it downstream
assert read(ctx, "bronze").select("source_file", "order_id").distinct().count() == 8

ctx = Ctx("rerun_merge", PARAMS, fail_once={"transform"}, idempotent=True)
run_job(job(), ctx)
run_job(job(), ctx)
assert count(ctx, "bronze") == 8  # a merge keyed on (file, order) makes the same rerun harmless

# ---- §8.5 a retry after a write that already committed ------------------------------------------------------------
for idempotent, expected in ((False, 2), (True, 1)):
    ctx = Ctx(f"retry_{idempotent}", PARAMS, idempotent=idempotent)
    ctx.fail_after_write_once.add("publish")
    res = run_job(job(publish_retries=1), ctx)
    assert res["publish"] == {"state": "SUCCEEDED", "attempts": 2}, res["publish"]
    assert count(ctx, "published") == expected  # append: the committed first attempt plus the retry; merge: one row

# ---- §8.2 / §8.4 parameters, task values and a condition task ------------------------------------------------------
ctx = Ctx("params_ok", PARAMS)
ok = run_job(job(), ctx)
assert ctx.values["ingest"] == {"rows_read": 8} and ok["rows_ok"]["outcome"] is True and ok["publish"]["state"] == "SUCCEEDED"
ctx = Ctx("params_short", PARAMS, files=("orders-a.csv", "orders-b.csv"))  # file c has not arrived
short = run_job(job(), ctx)
assert ctx.values["ingest"] == {"rows_read": 6} and short["rows_ok"]["outcome"] is False
assert short["publish"]["state"] == "EXCLUDED" and not os.path.exists(ctx.path("published"))  # the condition kept publish from running
assert short["ingest"]["state"] == short["validate"]["state"] == "SUCCEEDED"

print("OK: Chapter 8 model reproduced (a model of documented semantics, not Databricks Jobs; the row counts are real Delta results)")
