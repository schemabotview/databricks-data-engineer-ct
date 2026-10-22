"""The job's entry points, one per task of resources/retail_daily.yml."""
import sys

from retail import bronze, gold, silver
from retail.session import build_session


def ingest() -> None:
    print("bronze rows:", bronze.ingest(build_session("ingest")))


def transform() -> None:
    silver.build(build_session("transform"))


def validate() -> None:
    """Fail the run if silver and quarantine hold more rows than arrived."""
    spark = build_session("validate")
    one = lambda sql: spark.sql(sql).first()[0]  # noqa: E731 — one value
    events = one("SELECT count(*) FROM bronze.orders")
    kept = one("SELECT count(*) FROM silver.orders")
    bad = one("SELECT count(*) FROM silver.quarantine")
    if kept + bad > events:
        sys.exit(f"validate: {kept} + {bad} rows from {events} events")


def publish() -> None:
    gold.build(build_session("publish"))


def alert() -> None:
    print("retail-daily failed: see the run's failed task")
