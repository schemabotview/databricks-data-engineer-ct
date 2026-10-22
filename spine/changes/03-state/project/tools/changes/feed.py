"""Shared by the stream lessons: land sample files in order, and run a query."""
import os
import shutil
from pathlib import Path

from retail.session import build_session

ORDERS = ("order_id STRING, store_id INT, amount DECIMAL(10,2), "
          "event_ts TIMESTAMP")
PAYMENTS = "p_order STRING, pay_ts TIMESTAMP"


def session(app: str):
    """The project's session, with a stream's state split 4 ways, not 200:
    fixed by a query's first run and kept in its checkpoint."""
    spark = build_session(app)
    spark.conf.set("spark.sql.shuffle.partitions", "4")
    return spark


def land(sample: str, into: str, first: int = 1, last: int = 4) -> str:
    """Copy sample files first..last into `into`, oldest first — Spark reads by
    file time, so each file gets its own minute and the order is fixed."""
    Path(into).mkdir(parents=True, exist_ok=True)
    for i, path in enumerate(sorted(Path(sample).glob("*.json")), start=1):
        if first <= i <= last:
            target = shutil.copy(path, into)
            os.utime(target, (1_700_000_000 + i * 60,) * 2)
    return into


def run(df, checkpoint: str, each_batch, mode: str = "append"):
    """Run `df` once over what has landed, one file per micro-batch."""
    query = (df.writeStream.outputMode(mode).foreachBatch(each_batch)
             .option("checkpointLocation", checkpoint)
             .trigger(availableNow=True).start())
    query.awaitTermination()
    return query.recentProgress
