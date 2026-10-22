"""Whose permissions a run uses: run_as, checked by Course 4's grant model."""
import runpy

model = runpy.run_path("tools/grant_matrix.py")   # prints its matrix first
missing = model["missing"]

print("\nretail_daily runs as retail-job (resources/retail_daily.yml), so:")
for task, action, table in [("ingest", "write", "retail.bronze.orders"),
                            ("transform", "write", "retail.silver.orders"),
                            ("publish", "write", "retail.gold.sales")]:
    lacks = missing("retail-job", action, table)
    print(f"  {task:9} {action} {table:22}", "refused" if lacks else "ok")
    if lacks:
        print(" " * 12, "lacks", ", ".join(lacks))
