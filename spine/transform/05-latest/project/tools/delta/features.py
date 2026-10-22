"""What a reader and a writer must support: protocol versions and features."""
from retail.session import build_session

spark = build_session("features")
for table in ("lab.ret", "lab.feed", "lab.contract"):
    d = spark.sql(f"DESCRIBE DETAIL {table}").first()
    print(f"{table:13} reader {d.minReaderVersion}, "
          f"writer {d.minWriterVersion}:", ", ".join(sorted(d.tableFeatures)))
spark.stop()
