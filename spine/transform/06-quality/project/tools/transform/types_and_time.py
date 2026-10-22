"""Types, NULL, time zones and nested data: four ways to be quietly wrong."""
from retail.session import build_session

spark = build_session("types")
sql = spark.sql
n = lambda q: sql(q).first()[0]  # noqa: E731 — one value from a query
amount = "try_cast(amount AS DECIMAL(10,2))"

for text in ("40.00", "n/a", "-5.00"):
    print(f"try_cast({text!r}) =",
          n(f"SELECT try_cast('{text}' AS DECIMAL(10,2))"))
for test in ("= NULL", "IS NULL"):
    print(f"rows WHERE amount {test}:",
          n(f"SELECT count(*) FROM bronze.orders WHERE {amount} {test}"))
for zone in ("UTC", "America/New_York"):
    spark.conf.set("spark.sql.session.timeZone", zone)
    print(f"'2026-10-01 09:14' in {zone}: epoch",
          n("SELECT unix_timestamp(TIMESTAMP '2026-10-01 09:14:00')"))

sql("""CREATE OR REPLACE TEMP VIEW baskets AS SELECT * FROM VALUES
       ('o1', 40.00, array('A1', 'B2')), ('o2', 25.00, array('A1'))
       AS t(order_id, amount, items)""")
print("sum(amount):", n("SELECT sum(amount) FROM baskets"), "| after explode:",
      n("SELECT sum(amount) FROM baskets LATERAL VIEW explode(items) i AS x"))
spark.stop()
