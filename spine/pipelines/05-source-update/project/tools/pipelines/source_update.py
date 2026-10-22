"""A stream over a Delta table, and an UPDATE of a row it already read."""
from retail.errors import reason
from retail.session import build_session

spark = build_session("source-update")
spark.sql("CREATE SCHEMA IF NOT EXISTS lab")
spark.sql("CREATE OR REPLACE TABLE lab.src (order_id STRING, status STRING)")
spark.sql("INSERT INTO lab.src VALUES ('o1', 'PENDING'), ('o2', 'PENDING')")


def stream(**options):
    reader = spark.readStream.options(**options).table("lab.src")
    query = (reader.writeStream.option("checkpointLocation", "checkpoints/src")
             .trigger(availableNow=True).toTable("lab.copy"))
    query.awaitTermination()
    return spark.table("lab.copy").count()


print("first run, copy has:", stream(), "rows")
spark.sql("UPDATE lab.src SET status = 'COMPLETED' WHERE order_id = 'o1'")
try:
    stream()
except Exception as error:
    cause = str(error).split("terminated with exception: ")[-1]
    print("after an UPDATE:", reason(cause).split()[0])
print("with skipChangeCommits:", stream(skipChangeCommits="true"), "rows",
      "— the update never arrives")
spark.sql("INSERT INTO lab.src VALUES ('o3', 'PENDING')")
print("after an INSERT:", stream(skipChangeCommits="true"), "rows")
spark.stop()
