"""A MODEL of Unity Catalog's documented grant rules, applied to grants.sql.

Not Unity Catalog: it shows only that the matrix follows from the grants.
  - a grant on a catalog or schema is inherited by everything under it
  - reading needs USE CATALOG + USE SCHEMA + SELECT; writing needs MODIFY
  - ALL PRIVILEGES on a schema includes USE SCHEMA, SELECT and MODIFY
"""
import re
from pathlib import Path

GRANT = re.compile(r"GRANT (.+?) ON (?:CATALOG|SCHEMA) (\S+) TO `(.+?)`;")
ALL = {"USE SCHEMA", "SELECT", "MODIFY"}
sql = Path("governance/grants.sql").read_text()
grants = [(who, p.strip(), on)
          for privs, on, who in GRANT.findall(sql) for p in privs.split(",")]


def missing(who: str, action: str, table: str) -> list[str]:
    catalog, schema, _ = table.split(".")
    need = [("USE CATALOG", catalog), ("USE SCHEMA", f"{catalog}.{schema}"),
            ("SELECT" if action == "read" else "MODIFY", f"{catalog}.{schema}")]
    held = {(p, on) for w, p, on in grants if w == who}
    held |= {(p, on) for w, q, on in grants
             if w == who and q == "ALL PRIVILEGES" for p in ALL}
    return [f"{p} on {on}" for p, on in need if (p, on) not in held]


CHECKS = [("read", "retail.bronze.orders"), ("read", "retail.silver.orders"),
          ("write", "retail.silver.orders"), ("read", "retail.gold.sales")]
print(f"{'':16}" + "  ".join(f"{a} {t.split('.')[1]}" for a, t in CHECKS))
for who in dict.fromkeys(w for w, _, _ in grants):
    cells = [("no" if missing(who, a, t) else "yes").ljust(
        len(f"{a} {t.split('.')[1]}") + 2) for a, t in CHECKS]
    print(f"{who:16}" + "".join(cells).rstrip())
print("\nfinance reading retail.silver.orders is refused; it lacks:")
for need in missing("finance", "read", "retail.silver.orders"):
    print("  " + need)
