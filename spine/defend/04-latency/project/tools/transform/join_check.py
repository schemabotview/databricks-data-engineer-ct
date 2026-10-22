"""A duplicated reference row: the join still works, and the total grows."""
from retail.session import build_session

spark = build_session("join-check")
spark.sql("""CREATE OR REPLACE TEMP VIEW completed AS SELECT * FROM VALUES
    ('o1', 7, 40.00), ('o2', 7, 25.00), ('o4', 9, 15.00), ('o5', 12, 80.00),
    ('o6', 7, 10.00) AS t(order_id, store_id, amount)""")  # silver's 5 (§8)
stores = spark.read.option("header", True) \
    .schema("store_id INT, city STRING").csv("data/reference/stores.csv")
stores.createOrReplaceTempView("stores")
stores.union(stores.where("store_id = 9")).createOrReplaceTempView("stores_dup")

for ref in ("stores", "stores_dup"):  # stores_dup: York was sent twice
    r = spark.sql(f"""SELECT count(*) AS n, sum(amount) AS total
                      FROM completed o JOIN {ref} s
                      ON s.store_id = o.store_id""").first()
    print(f"joined to {ref:10}: {r.n} rows, total {r.total}")

guard = spark.sql("""SELECT store_id, count(*) AS n FROM stores_dup
                     GROUP BY store_id HAVING count(*) > 1""")
print("the guard finds:", [tuple(r) for r in guard.collect()])
spark.stop()
