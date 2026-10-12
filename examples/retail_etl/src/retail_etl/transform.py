"""Pure DataFrame transformations for the retail order flow (Chapter 5), free of I/O so they can be unit-tested.

Each function takes DataFrames and returns a DataFrame; reading and writing belong to the job that calls them.
"""
from pyspark.sql import DataFrame, Window, functions as F

ALLOWED_STATUS = ("COMPLETED", "CANCELLED", "PENDING")


def type_orders(raw: DataFrame) -> DataFrame:
    """Cast the text columns to real types. An unreadable amount becomes NULL (try_cast), never an error."""
    return raw.select(
        "order_id",
        F.col("store_id").cast("int").alias("store_id"),
        F.expr("try_cast(amount AS DECIMAL(10,2))").alias("amount"),
        "status",
        F.col("event_ts").cast("timestamp").alias("event_ts"),
        "source_file",
    )


def apply_rules(typed: DataFrame, stores: DataFrame) -> DataFrame:
    """Add `reason`: the first quality rule a row breaks, or NULL when it passes. `stores` must have a unique store_id."""
    known = stores.select(F.col("store_id").alias("known_store_id"))
    return (
        typed.join(known, typed.store_id == known.known_store_id, "left")
        .withColumn(
            "reason",
            F.when(F.col("amount").isNull(), "amount unreadable")
            .when(F.col("amount") <= 0, "amount not positive")
            .when(F.col("known_store_id").isNull(), "unknown store")
            .when(~F.col("status").isin(*ALLOWED_STATUS), "bad status"),
        )
        .drop("known_store_id")
    )


def latest_per_order(valid: DataFrame) -> DataFrame:
    """One row per order: the latest event, with source_file as a tie-breaker so ties are decided the same way every time."""
    order = Window.partitionBy("order_id").orderBy(F.col("event_ts").desc(), F.col("source_file").desc())
    return valid.withColumn("rn", F.row_number().over(order)).filter("rn = 1").drop("rn")


def sales_by_store(orders: DataFrame, stores: DataFrame) -> DataFrame:
    """COMPLETED orders and their amount per store. `stores` must have a unique store_id, or totals inflate."""
    return (
        orders.filter("status = 'COMPLETED'")
        .join(stores, "store_id")
        .groupBy("store_id", F.col("name").alias("store_name"))
        .agg(F.count("*").alias("orders"), F.sum("amount").alias("sales"))
    )


def run(raw: DataFrame, stores: DataFrame):
    """The whole flow on in-memory DataFrames: (silver, quarantined, gold)."""
    checked = apply_rules(type_orders(raw), stores)
    silver = latest_per_order(checked.filter("reason IS NULL").drop("reason"))
    quarantined = checked.filter("reason IS NOT NULL")
    return silver, quarantined, sales_by_store(silver, stores)


def main() -> None:  # pragma: no cover - the job entry point; reading and writing live here, not above
    raise SystemExit("wire this entry point to your tables; see the bundle's job definition")
