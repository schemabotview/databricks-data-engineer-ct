"""Two JSON files, the second different: a fixed schema, then inference."""
from retail.session import build_session

spark = build_session("drift")
FIXED = "order_id STRING, store_id INT, amount DECIMAL(10,2), status STRING"

fixed = spark.read.schema(FIXED).json("data/samples/drift")
o8 = fixed.where("order_id = 'o8'").first()
print("fixed schema: o8 amount", o8.amount,
      "| channel kept:", "channel" in fixed.columns)

first = spark.read.json("data/samples/drift/1.json")
both = spark.read.json("data/samples/drift")
print("inferred from 1.json:", dict(first.dtypes)["amount"])
print("inferred from both:  ", dict(both.dtypes)["amount"],
      "| new column channel:", "channel" in both.columns)
spark.stop()
