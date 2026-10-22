"""A crash after writing, before the checkpoint: the batch runs again."""
from feed import ORDERS, land, session

spark = session("sinks")
source = land("data/samples/stream/orders", "data/landing/stream/orders")
spark.sql("CREATE SCHEMA IF NOT EXISTS lab")
for name in ("append", "merged"):
    spark.sql(f"CREATE OR REPLACE TABLE lab.sink_{name} (order_id STRING, "
              "event_ts TIMESTAMP, amount DECIMAL(10,2))")
crash = {"once": True}


def write(batch, batch_id):
    rows = batch.select("order_id", "event_ts", "amount")
    rows.write.mode("append").saveAsTable("lab.sink_append")
    rows.dropDuplicates(["order_id", "event_ts"]).createOrReplaceTempView("b")
    batch.sparkSession.sql("""MERGE INTO lab.sink_merged t USING b s
        ON t.order_id = s.order_id AND t.event_ts = s.event_ts
        WHEN NOT MATCHED THEN INSERT (order_id, event_ts, amount)
        VALUES (s.order_id, s.event_ts, s.amount)""")
    if batch_id == 2 and crash.pop("once", False):
        raise RuntimeError("crashed after writing batch 2")


def go():
    query = (spark.readStream.schema(ORDERS).option("maxFilesPerTrigger", 1)
             .json(source).writeStream.foreachBatch(write)
             .option("checkpointLocation", "checkpoints/sinks")
             .trigger(availableNow=True).start())
    try:
        query.awaitTermination()
        outcome = "finished"
    except Exception:
        outcome = "crashed"
    rows = [spark.table(f"lab.sink_{n}").count() for n in ("append", "merged")]
    print(f"{outcome:8} append sink: {rows[0]:2} rows | "
          f"merge sink: {rows[1]} rows")


go()  # batches 0, 1, 2 are written; the crash comes before 2 is committed
go()  # restarted: batch 2 is run again, then 3
spark.stop()
