"""History gone, table intact, source replayed: what recovery needs."""
from retail import cdc
from retail.errors import reason
from retail.session import build_session

spark = build_session("recovery")
changes = spark.read.schema(cdc.CHANGES).json("data/samples/cdc")
state = "SELECT order_id, status, seq, is_deleted FROM {} ORDER BY order_id"

spark.conf.set("spark.databricks.delta.retentionDurationCheck.enabled", "false")
spark.sql("VACUUM lab.sequenced RETAIN 0 HOURS")  # history's files: gone
try:
    spark.read.option("readChangeFeed", "true").option("startingVersion", 1) \
        .table("lab.sequenced").collect()
except Exception as error:
    print("change feed from version 1:", reason(error).split()[0])
print("table now:", " · ".join(f"{r.order_id} {r.status} seq {r.seq}" + (
    " (deleted)" if r.is_deleted else "") for r in spark.sql(
    state.format("lab.sequenced")).collect()))

cdc.create(spark, "lab.rebuilt")  # from the source's records, all at once,
cdc.apply(spark, "lab.rebuilt", changes)  # duplicates and late ones included
same = spark.sql(state.format("lab.rebuilt")).collect() == \
    spark.sql(state.format("lab.sequenced")).collect()
print("rebuilt from the source equals the table:", same)
spark.stop()
