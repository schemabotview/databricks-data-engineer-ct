"""Three batches of change records, applied by arrival and by sequence."""
from retail import cdc
from retail.session import build_session

spark = build_session("cdc-apply")
spark.sql("CREATE SCHEMA IF NOT EXISTS lab")
batches = [spark.read.schema(cdc.CHANGES)
           .json(f"data/samples/cdc/batch-{n}.json") for n in (1, 2, 3)]


def rows(table):
    found = spark.table(table).orderBy("order_id").collect()
    return " · ".join(f"{r.order_id} {r.amount} {r.status}" + (
        " (deleted)" if r.asDict().get("is_deleted") else "") for r in found)


spark.sql("CREATE OR REPLACE TABLE lab.naive (order_id STRING, store_id INT, "
          "amount DECIMAL(10,2), status STRING)")
for batch in batches:  # naive: arrival order, hard deletes, no sequence
    batch.createOrReplaceTempView("b")
    spark.sql("""MERGE INTO lab.naive t USING b s ON t.order_id = s.order_id
        WHEN MATCHED AND s.op = 'D' THEN DELETE
        WHEN MATCHED THEN UPDATE SET amount = s.amount, status = s.status
        WHEN NOT MATCHED AND s.op != 'D' THEN INSERT *""")
print("by arrival: ", rows("lab.naive"))

for name, order in [("by sequence", batches), ("reversed", batches[::-1]),
                    ("replayed", batches + batches)]:
    table = f"lab.cdc_{name.split()[-1]}"
    cdc.create(spark, table)
    for batch in order:
        cdc.apply(spark, table, batch)
    print(f"{name + ':':12}", rows(table))
spark.stop()
