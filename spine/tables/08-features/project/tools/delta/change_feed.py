"""The change data feed: row-level changes, from the version it was enabled."""
from retail.errors import reason
from retail.session import build_session

spark = build_session("change-feed")
sql = spark.sql
sql("CREATE SCHEMA IF NOT EXISTS lab")
sql("DROP TABLE IF EXISTS lab.feed")
sql("""CREATE TABLE lab.feed (order_id STRING, status STRING)
       TBLPROPERTIES (delta.enableChangeDataFeed = true)""")
sql("INSERT INTO lab.feed VALUES ('o1', 'PENDING'), ('o2', 'PENDING')")
sql("UPDATE lab.feed SET status = 'COMPLETED' WHERE order_id = 'o1'")
sql("DELETE FROM lab.feed WHERE order_id = 'o2'")

(spark.read.option("readChangeFeed", "true").option("startingVersion", 1)
    .table("lab.feed")
    .select("order_id", "status", "_change_type", "_commit_version")
    .orderBy("_commit_version", "order_id", "_change_type").show())

sql("DROP TABLE IF EXISTS lab.late")
sql("CREATE TABLE lab.late (id INT)")
sql("INSERT INTO lab.late VALUES (1)")
sql("ALTER TABLE lab.late "
    "SET TBLPROPERTIES (delta.enableChangeDataFeed = true)")
try:
    spark.read.option("readChangeFeed", "true").option("startingVersion", 1) \
        .table("lab.late").collect()
except Exception as error:
    print("before it was enabled:", reason(error))
spark.stop()
