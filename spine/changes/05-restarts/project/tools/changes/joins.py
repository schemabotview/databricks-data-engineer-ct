"""Orders joined to payments made within 15 minutes: a stream-stream join."""
from pyspark.sql import functions as F

from feed import ORDERS, PAYMENTS, land, run, session

spark = session("joins")


def stream(sample, schema, time):
    source = land(f"data/samples/stream/{sample}",
                  f"data/landing/stream/{sample}")
    return (spark.readStream.schema(schema).option("maxFilesPerTrigger", 1)
            .json(source).withWatermark(time, "10 minutes"))


paid = F.expr("p_order = order_id AND pay_ts BETWEEN event_ts "
              "AND event_ts + INTERVAL 15 MINUTES")
for how in ("inner", "leftOuter"):
    pairs = stream("orders", ORDERS, "event_ts").join(
        stream("payments", PAYMENTS, "pay_ts"), paid, how)

    def show(batch, i):
        rows = [f"{r.order_id}→" + (f"{r.pay_ts:%H:%M}" if r.pay_ts
                                     else "unpaid")
                for r in batch.orderBy("order_id").collect()]
        print(f"{how:9} batch {i}: {', '.join(rows) or '(nothing yet)'}")
    run(pairs, f"checkpoints/join-{how}", show)
spark.stop()
