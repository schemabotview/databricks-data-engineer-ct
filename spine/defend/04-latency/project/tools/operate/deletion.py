"""A customer asks to be deleted: where their data still is after DELETE."""
from retail.errors import reason
from retail.session import build_session

spark = build_session("deletion")
sql = spark.sql
sql("CREATE SCHEMA IF NOT EXISTS lab")
sql("""CREATE OR REPLACE TABLE lab.orders_pii (order_id STRING,
    customer STRING, amount DECIMAL(10,2))
    TBLPROPERTIES (delta.enableChangeDataFeed = true)""")
sql("INSERT INTO lab.orders_pii VALUES ('o1', 'c1', 40.00), "
    "('o2', 'c1', 25.00), ('o3', 'c2', 35.00)")
sql("CREATE OR REPLACE TABLE lab.spend AS "
    "SELECT sum(amount) AS total FROM lab.orders_pii")    # derived, before
sql("DELETE FROM lab.orders_pii WHERE customer = 'c1'")      # version 2

where = {
    "the table now": "SELECT count(*) FROM lab.orders_pii WHERE customer='c1'",
    "version 1": "SELECT count(*) FROM lab.orders_pii VERSION AS OF 1 "
                 "WHERE customer = 'c1'",
    "change feed": "SELECT count(*) FROM table_changes('lab.orders_pii', 2) "
                   "WHERE customer = 'c1'",
    "lab.spend": "SELECT total FROM lab.spend",
}


def look(when):
    for place, query in where.items():
        try:
            found = sql(query).first()[0]
        except Exception as error:
            found = reason(error).split()[0]
        print(f"  {when:13} {place:14} {found}")


look("after DELETE")
spark.conf.set("spark.databricks.delta.retentionDurationCheck.enabled",
               "false")
sql("VACUUM lab.orders_pii RETAIN 0 HOURS")
look("after VACUUM")
sql("INSERT OVERWRITE lab.spend SELECT sum(amount) FROM lab.orders_pii")
print("  recomputed    lab.spend     ", sql("SELECT total FROM lab.spend")
      .first()[0])
spark.stop()
