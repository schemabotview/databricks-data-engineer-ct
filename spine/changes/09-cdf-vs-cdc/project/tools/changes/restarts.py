"""Stop a stream, let files arrive, start it again — then change the query."""
from pyspark.sql import functions as F

from feed import ORDERS, land, run, session
from retail.errors import reason

spark = session("restarts")
source = "data/landing/stream/orders"


def windows(*keys):
    return (spark.readStream.schema(ORDERS).option("maxFilesPerTrigger", 1)
            .json(source).withWatermark("event_ts", "10 minutes")
            .groupBy(F.window("event_ts", "10 minutes"), *keys)
            .agg(F.sum("amount").alias("sales")))


def count(batch, batch_id):
    batch.count()


land("data/samples/stream/orders", source, 1, 2)
first = run(windows(), "checkpoints/restarts", count)
land("data/samples/stream/orders", source, 3, 3)  # while it was stopped
again = run(windows(), "checkpoints/restarts", count)
print("first run batches:", [p["batchId"] for p in first],
      "| after restart:", [p["batchId"] for p in again])
land("data/samples/stream/orders", source, 4, 4)
try:  # the same checkpoint, a new grouping key
    run(windows("store_id"), "checkpoints/restarts", count)
except Exception as error:
    cause = str(error).split("terminated with exception: ")[-1]
    print("new grouping key:", reason(cause))  # the reason under STREAM_FAILED
spark.stop()
