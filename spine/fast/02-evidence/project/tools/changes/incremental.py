"""Recompute everything, or read only what is new: rows read, counted."""
from feed import ORDERS, land, run, session

spark = session("incremental")
source = "data/landing/stream/orders"
stream = spark.readStream.schema(ORDERS).option("maxFilesPerTrigger", 1)
full = new = 0
for n in range(1, 5):  # the four files arrive, one at a time
    land("data/samples/stream/orders", source, n, n)
    recompute = spark.read.schema(ORDERS).json(source).count()  # all so far
    batches = run(stream.json(source), "checkpoints/incremental",
                  lambda batch, i: batch.count())
    incremental = sum(p["numInputRows"] for p in batches)  # only the new rows
    full, new = full + recompute, new + incremental
    print(f"file {n}: recompute reads {recompute:2}, "
          f"incremental reads {incremental}")
print(f"total:  recompute {full}, incremental {new}")
spark.stop()
