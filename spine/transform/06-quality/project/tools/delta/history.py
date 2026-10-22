"""History, time travel and restore: three different things."""
from retail.session import build_session

spark = build_session("history")
sql = spark.sql
sql("DESCRIBE HISTORY lab.orders").select("version", "operation") \
    .orderBy("version").show()

then = sql("SELECT status FROM lab.orders VERSION AS OF 2 "
           "WHERE order_id = 'o6'").first().status
now = sql("SELECT status FROM lab.orders WHERE order_id = 'o6'").first().status
print(f"o6 at version 2: {then}, now: {now}")

sql("RESTORE TABLE lab.orders TO VERSION AS OF 4")
latest = sql("DESCRIBE HISTORY lab.orders LIMIT 1").first()
print(f"version {latest.version}: {latest.operation}, "
      f"{spark.table('lab.orders').count()} rows")
v5 = spark.read.option("versionAsOf", 5).table("lab.orders").count()
print(f"version 5 can still be read: {v5} rows")
spark.stop()
