"""The whole flow, once: landed files → bronze → silver → gold, reconciled."""
from retail import bronze, gold, silver
from retail.session import build_session


def main() -> None:
    spark = build_session("daily")
    events = bronze.ingest(spark)
    silver.build(spark)
    gold.build(spark)
    q = lambda sql: spark.sql(sql).first()[0]  # noqa: E731 — one value
    kept = q("SELECT count(*) FROM silver.orders")
    bad = q("SELECT count(*) FROM silver.quarantine")
    resent = events - q("SELECT count(DISTINCT order_id, store_id, amount, "
                        "status) FROM bronze.orders")
    print(f"{events} events = {kept} silver + {resent} resent + "
          f"{events - kept - resent - bad} superseded + {bad} quarantined")
    spark.sql("SELECT * FROM gold.sales ORDER BY city").show()
    print("completed in silver:", q("SELECT sum(amount) FROM silver.orders "
                                    "WHERE status = 'COMPLETED'"),
          "= gold:", q("SELECT sum(sales) FROM gold.sales"))
    spark.stop()


if __name__ == "__main__":
    main()
