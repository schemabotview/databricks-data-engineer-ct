"""The retail job's tasks, for the model in jobs.py: real Delta tables."""
from pyspark.sql import functions as F

from jobs import Task

ORDERS = "order_id STRING, store_id STRING, amount STRING, status STRING"
FILES = ["data/samples/orders-a.csv", "data/samples/orders-b.csv",
         "data/samples/orders-c.csv"]                  # 8 rows, as in Course 6


def context(spark, files=FILES, merge=False, faults=()):
    spark.sql("CREATE SCHEMA IF NOT EXISTS job")
    for table in ("bronze", "silver", "published"):
        spark.sql(f"DROP TABLE IF EXISTS job.{table}")
    return {"spark": spark, "files": files, "merge": merge, "faults": set(faults),
            "log": [], "ran": [], "outcome": {}, "values": {},
            "params": {"run_date": "2026-10-01", "expected_rows": 8}}


def fault(ctx, name):  # a transient failure, injected once
    if name in ctx["faults"]:
        ctx["faults"].discard(name)
        raise RuntimeError(f"{name} failed")


def write(ctx, df, table, key):  # append, or MERGE on the key
    spark = ctx["spark"]
    if not ctx["merge"] or not spark.catalog.tableExists(f"job.{table}"):
        df.write.mode("append").saveAsTable(f"job.{table}")
        return
    df.createOrReplaceTempView("rows")
    on = " AND ".join(f"t.{k} = s.{k}" for k in key)
    spark.sql(f"MERGE INTO job.{table} t USING rows s ON {on} "
              "WHEN NOT MATCHED THEN INSERT *")


def ingest(ctx):
    rows = ctx["spark"].read.schema(ORDERS).option("header", True) \
        .csv(ctx["files"]) \
        .withColumn("source_file", F.col("_metadata.file_name"))
    write(ctx, rows, "bronze", ["source_file", "order_id"])
    ctx["values"]["rows_read"] = rows.count()            # a task value


def transform(ctx):
    fault(ctx, "transform")
    ctx["spark"].sql("""SELECT DISTINCT order_id, CAST(store_id AS INT)
        store_id, try_cast(amount AS DECIMAL(10,2)) amount, status
        FROM job.bronze WHERE try_cast(amount AS DECIMAL(10,2)) IS NOT NULL
        """).write.mode("overwrite").saveAsTable("job.silver")


def validate(ctx):
    if ctx["spark"].table("job.silver").count() != 6:
        raise RuntimeError("silver should hold 6 orders")


def rows_ok(ctx):  # a condition task: its outcome decides publish
    ok = ctx["values"]["rows_read"] >= ctx["params"]["expected_rows"]
    ctx["outcome"]["rows_ok"] = ok


def publish(ctx):
    spark = ctx["spark"]
    total = spark.sql("SELECT sum(amount) FROM job.silver "
                      "WHERE status = 'COMPLETED'").first()[0]
    row = spark.sql(f"SELECT '{ctx['params']['run_date']}' AS run_date, "
                    f"CAST({total} AS DECIMAL(10,2)) AS total")
    write(ctx, row, "published", ["run_date"])
    fault(ctx, "publish")   # after the write: e.g. a timeout


def alert(ctx):
    ctx["log"].append("alert: sent to the on-call channel")


def retail_daily(publish_retries=0):
    return [
        Task("ingest", ingest),
        Task("transform", transform, ["ingest"]),
        Task("validate", validate, ["transform"]),
        Task("rows_ok", rows_ok, ["ingest"]),
        Task("publish", publish, ["validate", ("rows_ok", True)],
             retries=publish_retries),
        Task("alert", alert, ["transform"], run_if="AT_LEAST_ONE_FAILED"),
    ]


def count(ctx, table):
    return ctx["spark"].table(f"job.{table}").count()
