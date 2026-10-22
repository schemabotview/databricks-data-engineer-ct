"""Files land one at a time; each bronze.ingest reads only the new ones."""
import shutil
from pathlib import Path

from retail import bronze
from retail.session import build_session

spark = build_session("arrival")
landing = Path(bronze.LANDING)
landing.mkdir(parents=True, exist_ok=True)

for sample in ["orders-a.csv", "orders-b.csv", None, "orders-c.csv"]:
    if sample:
        shutil.copy(f"data/samples/{sample}", landing)
    rows = bronze.ingest(spark)
    print(f"landed {sample or 'nothing':13} → bronze: {rows} rows")

kept = sorted(p.name for p in Path(bronze.CHECKPOINT).iterdir())
print("checkpoint holds:", ", ".join(kept))
shutil.rmtree(bronze.CHECKPOINT)   # the memory of what was read, lost
print("no checkpoint  → bronze:", bronze.ingest(spark), "rows")
spark.stop()
