"""Deduplicating a stream: state that grows forever, or state that expires."""
from feed import ORDERS, land, run, session

spark = session("state")
source = land("data/samples/stream/orders", "data/landing/stream/orders")
orders = spark.readStream.schema(ORDERS) \
    .option("maxFilesPerTrigger", 1).json(source)

for name, stream in [
    ("no watermark", orders),
    ("10-minute watermark", orders.withWatermark("event_ts", "10 minutes")),
]:
    kept = {}  # rows each batch let through
    unique = stream.dropDuplicates(["order_id", "event_ts"])  # o4 is resent
    progress = run(unique, f"checkpoints/state-{name.split()[0]}",
                   lambda batch, i: kept.update({i: batch.count()}))
    sizes = [p["stateOperators"][0]["numRowsTotal"] for p in progress]
    print(f"{name:20} kept {sum(kept.values())} of 10,",
          f"state rows after each batch: {sizes}")
spark.stop()
