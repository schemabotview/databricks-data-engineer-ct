"""The same changes kept two ways: latest only (SCD 1), or history (SCD 2)."""
from retail import cdc
from retail.session import build_session

spark = build_session("scd")
spark.read.schema(cdc.CHANGES).json("data/samples/cdc") \
    .dropDuplicates(["order_id", "op", "seq"]).createOrReplaceTempView("events")
print("change records:", spark.table("events").count(),
      "(one of the 8 was a repeat)")

print("SCD type 1 — the current row, deletes removed:")
spark.sql("""SELECT order_id, amount, status FROM (
    SELECT *, row_number() OVER (PARTITION BY order_id ORDER BY seq DESC) n
    FROM events) WHERE n = 1 AND op != 'D' ORDER BY order_id""").show()

print("SCD type 2 — every version, valid from one sequence to the next:")
spark.sql("""SELECT * FROM (
    SELECT order_id, op, amount, status, seq AS valid_from,
      lead(seq) OVER (PARTITION BY order_id ORDER BY seq) AS valid_to
    FROM events) WHERE op != 'D' ORDER BY order_id, valid_from""").show()
spark.stop()
