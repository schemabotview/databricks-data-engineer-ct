"""Six typed orders, then one more: what a Delta version is, on disk."""
import json
from pathlib import Path

from retail.session import build_session

spark = build_session("versions")
spark.sql("CREATE SCHEMA IF NOT EXISTS lab")
spark.sql("DROP TABLE IF EXISTS lab.orders")
spark.sql("""CREATE TABLE lab.orders (order_id STRING NOT NULL, store_id INT,
                                     amount DECIMAL(10,2), status STRING)""")
spark.sql("""INSERT INTO lab.orders VALUES
    ('o1', 7, 40.00, 'COMPLETED'), ('o2', 7, 25.00, 'COMPLETED'),
    ('o3', 9, 60.00, 'CANCELLED'), ('o4', 9, 15.00, 'COMPLETED'),
    ('o5', 12, 80.00, 'COMPLETED'), ('o6', 7, 10.00, 'PENDING')""")
spark.sql("INSERT INTO lab.orders VALUES ('o8', 12, 20.00, 'PENDING')")

log = Path("spark-warehouse/lab.db/orders/_delta_log")
for commit in sorted(log.glob("*.json")):
    version = int(commit.stem)
    actions = [next(iter(json.loads(line))) for line in commit.open()]
    rows = spark.read.option("versionAsOf", version).table("lab.orders").count()
    print(f"version {version}: {rows} rows  {' '.join(actions)}")
spark.stop()
