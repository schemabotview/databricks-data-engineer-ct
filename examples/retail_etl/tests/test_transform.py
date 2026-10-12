from decimal import Decimal

from helpers import assert_rows_equal, rows
from retail_etl import transform as t

D = Decimal


# ---- unit tests: one function, small inputs, exact expected rows ---------------------------------------------------
def test_unreadable_amount_becomes_null(raw):
    typed = t.type_orders(raw)
    assert_rows_equal(rows(typed.filter("order_id IN ('o1', 'o7')"), "order_id", "amount"),
                      [("o1", D("40.00")), ("o7", None)])


def test_rules_name_the_first_failing_rule(raw, stores):
    reasons = rows(t.apply_rules(t.type_orders(raw), stores).filter("reason IS NOT NULL"), "order_id", "reason")
    assert_rows_equal(reasons, [("o7", "amount unreadable"), ("o8", "amount not positive"), ("o9", "unknown store")])


def test_latest_per_order_keeps_the_newest_event_and_breaks_ties(raw, stores):
    valid = t.apply_rules(t.type_orders(raw), stores).filter("reason IS NULL").drop("reason")
    latest = t.latest_per_order(valid)
    assert_rows_equal(rows(latest.filter("order_id IN ('o4', 'o6')"), "order_id", "status", "source_file"),
                      [("o4", "COMPLETED", "orders-c.csv"), ("o6", "COMPLETED", "orders-d.csv")])


def test_duplicate_store_key_inflates_the_total(spark, raw, stores):
    """A guard test: documents WHY the reference key must be unique."""
    silver, _, _ = t.run(raw, stores)
    duplicated = stores.unionByName(spark.createDataFrame([(9, "York")], "store_id int, name string"))
    total = t.sales_by_store(silver, duplicated).agg({"sales": "sum"}).collect()[0][0]
    assert total == D("185.00")


# ---- integration test: the whole flow, one assertion per layer -------------------------------------------------------
def test_end_to_end_flow(raw, stores):
    silver, quarantined, gold = t.run(raw, stores)
    assert (raw.count(), silver.count(), quarantined.count()) == (11, 6, 3)
    assert_rows_equal(rows(gold, "store_id", "store_name", "orders", "sales"),
                      [(7, "Leeds", 3, D("75.00")), (9, "York", 1, D("15.00")), (12, "Hull", 1, D("80.00"))])


# ---- data-quality tests: properties the OUTPUT must always have ------------------------------------------------------
def test_silver_has_one_row_per_order_and_no_nulls(raw, stores):
    silver, _, _ = t.run(raw, stores)
    assert silver.select("order_id").distinct().count() == silver.count()
    assert silver.filter("amount IS NULL OR amount <= 0").count() == 0


def test_gold_equals_silver_detail(raw, stores):
    silver, _, gold = t.run(raw, stores)
    detail = silver.filter("status = 'COMPLETED'").agg({"amount": "sum"}).collect()[0][0]
    assert gold.agg({"sales": "sum"}).collect()[0][0] == detail == D("170.00")
