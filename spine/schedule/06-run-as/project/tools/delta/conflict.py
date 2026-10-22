"""Two writers, one row: Delta lets one commit and refuses the other."""
import threading
import time

from retail.errors import reason
from retail.session import build_session

spark = build_session("conflict")
sql = spark.sql
sql("CREATE SCHEMA IF NOT EXISTS lab")
sql("DROP TABLE IF EXISTS lab.race")
sql("CREATE TABLE lab.race "
    "(order_id STRING, amount DECIMAL(10,2), status STRING)")
sql("INSERT INTO lab.race VALUES ('o1', 40.00, 'COMPLETED'), "
    "('o2', 25.00, 'COMPLETED')")
spark.udf.register("slow", lambda x: (time.sleep(2), x)[1], "string")


def writer(name, statement, delay):
    time.sleep(delay)
    try:
        sql(statement)
        print(f"writer {name}: committed")
    except Exception as error:
        print(f"writer {name}: refused,", reason(error))


# A reads o1 slowly, so B, which starts a second later, commits first
a = threading.Thread(target=writer, args=(
    "A", "UPDATE lab.race SET status = 'SHIPPED' "
         "WHERE slow(order_id) = 'o1'", 0))
b = threading.Thread(target=writer, args=(
    "B", "UPDATE lab.race SET amount = 41.00 WHERE order_id = 'o1'", 1))
a.start(), b.start(), a.join(), b.join()
sql("SELECT * FROM lab.race ORDER BY order_id").show()
spark.stop()
