"""UPDATE, DELETE and MERGE on lab.orders, each a new version."""
from retail.errors import reason
from retail.session import build_session

spark = build_session("changes")
sql = spark.sql
sql("UPDATE lab.orders SET status = 'COMPLETED' WHERE order_id = 'o6'")
sql("DELETE FROM lab.orders WHERE order_id = 'o3'")
sql("""MERGE INTO lab.orders t USING (SELECT * FROM VALUES
    ('o8', 12, 20.00, 'COMPLETED'), ('o9', 9, 45.00, 'COMPLETED')
    AS v(order_id, store_id, amount, status)) s ON t.order_id = s.order_id
    WHEN MATCHED THEN UPDATE SET status = s.status
    WHEN NOT MATCHED THEN INSERT *""")
sql("SELECT * FROM lab.orders WHERE order_id IN ('o3', 'o6', 'o8', 'o9') "
    "ORDER BY order_id").show()
try:  # two source rows for one target row: which one should win?
    sql("""MERGE INTO lab.orders t USING (SELECT * FROM VALUES
        ('o8', 'SHIPPED'), ('o8', 'CANCELLED') AS v(order_id, status)) s
        ON t.order_id = s.order_id
        WHEN MATCHED THEN UPDATE SET status = s.status""")
except Exception as error:
    print("refused:", reason(error))
spark.stop()
