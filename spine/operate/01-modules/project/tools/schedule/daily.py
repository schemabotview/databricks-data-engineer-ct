"""The retail job over the project's own modules, run on two days."""
from jobs import Task, run
from retail import bronze, gold, silver
from retail.session import build_session


def validate(ctx):  # every event accounted for, or the job stops here
    spark = ctx["spark"]
    one = lambda sql: spark.sql(sql).first()[0]  # noqa: E731 — one value
    events = one("SELECT count(*) FROM bronze.orders")
    kept = one("SELECT count(*) FROM silver.orders")
    bad = one("SELECT count(*) FROM silver.quarantine")
    if kept + bad > events:
        raise RuntimeError(f"{kept} + {bad} rows from {events} events")
    ctx["log"].append(f"validate: {events} events, {kept} silver, {bad} bad")


JOB = [
    Task("ingest", lambda ctx: bronze.ingest(ctx["spark"])),
    Task("transform", lambda ctx: silver.build(ctx["spark"]), ["ingest"]),
    Task("validate", validate, ["transform"]),
    Task("publish", lambda ctx: gold.build(ctx["spark"]), ["validate"]),
]

spark = build_session("retail-daily")
for day in ("2026-10-01", "2026-10-02"):        # no new files on day two
    ctx = {"spark": spark, "log": [], "ran": [], "outcome": {}}
    states = run(JOB, ctx)
    sales = spark.sql("SELECT sum(sales) FROM gold.sales").first()[0]
    print(day, " ".join(f"{k}={v}" for k, v in states.items()))
    print("   ", *ctx["log"], f"| gold total {sales}")
spark.stop()
