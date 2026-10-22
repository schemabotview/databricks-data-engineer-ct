"""What the source sent, against what the table's change feed recorded."""
from retail import cdc
from retail.session import build_session

spark = build_session("cdf-vs-cdc")
spark.sql("CREATE SCHEMA IF NOT EXISTS lab")
cdc.create(spark, "lab.sequenced", feed=True)
sent = 0
for n in (1, 2, 3):
    batch = spark.read.schema(cdc.CHANGES) \
        .json(f"data/samples/cdc/batch-{n}.json")
    sent += batch.count()
    cdc.apply(spark, "lab.sequenced", batch)

feed = (spark.read.option("readChangeFeed", "true").option("startingVersion", 1)
        .table("lab.sequenced"))
feed.groupBy("_commit_version", "_change_type").count() \
    .orderBy("_commit_version", "_change_type").show()
print(f"the source sent {sent} records; the feed holds {feed.count()} rows")
spark.stop()
