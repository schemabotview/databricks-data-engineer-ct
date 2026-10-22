"""Ten-minute windows over ten events, and a watermark that lets late data go"""
from pyspark.sql import functions as F

from feed import ORDERS, land, run, session

spark = session("watermarks")
source = land("data/samples/stream/orders", "data/landing/stream/orders")
sales = (spark.readStream.schema(ORDERS).option("maxFilesPerTrigger", 1)
         .json(source)
         .withWatermark("event_ts", "10 minutes")     # wait 10 minutes, no more
         .groupBy(F.window("event_ts", "10 minutes"))
         .agg(F.sum("amount").alias("sales")))
written = {}


def emitted(batch, batch_id):  # append mode: a window appears once, when final
    written[batch_id] = [f"{r.window.start:%H:%M} = {r.sales}"
                         for r in batch.orderBy("window").collect()]


for p in run(sales, "checkpoints/watermarks", emitted):
    mark = p["eventTime"].get("watermark", "")[11:16]
    print(f"batch {p['batchId']}: {p['numInputRows']} rows,",
          f"watermark {mark if mark != '00:00' else 'none':5}",
          "| wrote", ", ".join(written.get(p["batchId"], [])) or "nothing")
spark.stop()
