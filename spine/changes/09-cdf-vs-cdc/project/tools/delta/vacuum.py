"""VACUUM deletes the files old versions need: then they cannot be read."""
from retail.errors import reason
from retail.session import build_session

spark = build_session("vacuum")
sql = spark.sql
sql("CREATE SCHEMA IF NOT EXISTS lab")
sql("DROP TABLE IF EXISTS lab.ret")
sql("CREATE TABLE lab.ret (id INT)")
sql("INSERT INTO lab.ret VALUES (1), (2)")   # version 1
sql("INSERT INTO lab.ret VALUES (3)")        # version 2
sql("DELETE FROM lab.ret WHERE id = 1")      # version 3


def ids(version):
    rows = spark.read.option("versionAsOf", version).table("lab.ret").collect()
    return sorted(r.id for r in rows)


print("versions 1, 2, 3:", ids(1), ids(2), ids(3))
try:
    sql("VACUUM lab.ret RETAIN 0 HOURS")
except Exception as error:
    print("refused:", reason(error))

# a lesson only: never do this to a table someone may be reading
spark.conf.set(
    "spark.databricks.delta.retentionDurationCheck.enabled", "false")
print("files older than 0 hours:",
      sql("VACUUM lab.ret RETAIN 0 HOURS DRY RUN").count())
sql("VACUUM lab.ret RETAIN 0 HOURS")
print("version 3 after VACUUM:", ids(3))
try:
    ids(1)
except Exception as error:
    print("version 1 after VACUUM:", reason(error))
spark.stop()
