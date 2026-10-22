"""A table that keeps its contract: types, NOT NULL, a CHECK, and evolution."""
from retail.errors import reason
from retail.session import build_session

spark = build_session("contract")
sql = spark.sql
sql("CREATE SCHEMA IF NOT EXISTS lab")
sql("DROP TABLE IF EXISTS lab.contract")
sql("""CREATE TABLE lab.contract (order_id STRING NOT NULL,
       store_id INT, amount DECIMAL(10,2), status STRING)""")
sql("ALTER TABLE lab.contract "
    "ADD CONSTRAINT positive_amount CHECK (amount > 0)")
sql("INSERT INTO lab.contract VALUES ('o1', 7, 40.00, 'COMPLETED')")

for label, row in [("extra column", "('x', 1, 1.00, 'NEW', 'web')"),
                   ("bad store_id", "('x', 'abc', 1.00, 'NEW')"),
                   ("no order_id", "(NULL, 7, 5.00, 'NEW')"),
                   ("negative amount", "('o10', 7, -5.00, 'NEW')")]:
    try:
        sql(f"INSERT INTO lab.contract VALUES {row}")
    except Exception as error:
        print(f"{label}:", reason(error))

# evolution, on purpose: a new column, accepted because we ask for it
web = sql("SELECT 'o10' AS order_id, 7 AS store_id, 5.00 AS amount, "
          "'PENDING' AS status, 'web' AS channel")
web.write.mode("append").option("mergeSchema", "true") \
    .saveAsTable("lab.contract")
print("columns now:", ", ".join(spark.table("lab.contract").columns))
spark.stop()
