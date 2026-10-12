"""Checks the Chapter 2 permission matrix against a MODEL of Unity Catalog's documented grant rules.

This is NOT Unity Catalog and proves nothing about the platform. It checks that the matrix drawn on the
`least-privilege` board follows from the GRANT statements drawn beside it, under these documented rules:
  * a privilege granted on a catalog or schema is inherited by the objects beneath it;
  * reading a table needs USE CATALOG + USE SCHEMA + SELECT; writing needs USE CATALOG + USE SCHEMA + MODIFY;
  * ALL PRIVILEGES stands for every privilege that applies to the securable it is granted on.
Run:  python3 scripts/verify/ch02_governance_model.py     (standard library only)
"""

# (principal, privilege, securable) — securable is 'catalog', 'catalog.schema' or 'catalog.schema.table'.
GRANTS = [
    ("analysts", "USE CATALOG", "retail"),
    ("analysts", "USE SCHEMA", "retail.gold"),
    ("analysts", "SELECT", "retail.gold"),
    ("data_engineers", "USE CATALOG", "retail"),
    ("data_engineers", "ALL PRIVILEGES", "retail.bronze"),
    ("data_engineers", "ALL PRIVILEGES", "retail.silver"),
    ("etl_runner", "USE CATALOG", "retail"),
    ("etl_runner", "USE SCHEMA", "retail.bronze"),
    ("etl_runner", "SELECT", "retail.bronze"),
    ("etl_runner", "USE SCHEMA", "retail.silver"),
    ("etl_runner", "SELECT", "retail.silver"),
    ("etl_runner", "MODIFY", "retail.silver"),
]
ALL_ON_SCHEMA = {"USE SCHEMA", "SELECT", "MODIFY", "CREATE TABLE"}


def holds(principal: str, priv: str, securable: str) -> bool:
    """True if `principal` holds `priv` on `securable`, directly or by inheritance from an ancestor."""
    parts = securable.split(".")
    ancestors = [".".join(parts[: i + 1]) for i in range(len(parts))]
    for who, p, on in GRANTS:
        if who != principal or on not in ancestors:
            continue
        if p == priv or (p == "ALL PRIVILEGES" and priv in ALL_ON_SCHEMA and on.count(".") >= 1):
            return True
    return False


def can(principal: str, action: str, table: str) -> bool:
    catalog, schema, _ = table.split(".")
    need = {"read": "SELECT", "write": "MODIFY"}[action]
    return (
        holds(principal, "USE CATALOG", catalog)
        and holds(principal, "USE SCHEMA", f"{catalog}.{schema}")
        and holds(principal, need, table)
    )


COLUMNS = [("read", "retail.bronze.orders"), ("read", "retail.silver.orders"),
           ("write", "retail.silver.orders"), ("read", "retail.gold.sales")]
EXPECTED = {  # exactly what the board shows: yes / no per column above
    "analysts": [False, False, False, True],
    "data_engineers": [True, True, True, False],
    "etl_runner": [True, True, True, False],
}
for who, want in EXPECTED.items():
    got = [can(who, a, t) for a, t in COLUMNS]
    assert got == want, (who, got, want)
print("OK: matrix follows from the grants under the modelled rules (a model, not Unity Catalog)")
