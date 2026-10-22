"""Many small files, then OPTIMIZE: the same rows in far fewer files."""
from lab import files, files_read, generate, session, spread

spark = session("compaction")
spark.sql("CREATE SCHEMA IF NOT EXISTS fast")
spread(generate(spark), 200).write.mode("overwrite") \
    .saveAsTable("fast.small")                # 200 writers: small files
small = spark.table("fast.small")
print("before: files", files(spark, "fast.small"),
      "| opened by store_id = 7:", files_read(small.where("store_id = 7")))
spark.sql("OPTIMIZE fast.small")              # bin-packing into larger files
small = spark.table("fast.small")
print("after:  files", files(spark, "fast.small"),
      "| opened by store_id = 7:", files_read(small.where("store_id = 7")),
      "| rows", f"{small.count():,}")
spark.stop()
