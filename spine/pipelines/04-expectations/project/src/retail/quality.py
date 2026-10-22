"""The rules a silver row must pass; a row that fails gets the first reason."""
from pyspark.sql import Column
from pyspark.sql import functions as F

RULES = [  # (reason, the SQL condition that FAILS a row), checked in this order
    ("amount unreadable", "amount IS NULL"),
    ("amount not positive", "amount <= 0"),
    ("unknown store", "city IS NULL"),
    ("bad status", "status NOT IN ('COMPLETED', 'CANCELLED', 'PENDING')"),
]


def reason() -> Column:
    """The first rule a row fails, or NULL when it passes them all."""
    first = F.lit(None).cast("string")
    for name, fails in reversed(RULES):
        first = F.when(F.expr(fails), name).otherwise(first)
    return first
