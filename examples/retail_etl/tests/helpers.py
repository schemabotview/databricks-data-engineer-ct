"""A small row comparison that reports WHAT differs, not just that something does."""
from collections import Counter


def rows(df, *cols):
    return Counter(tuple(r[c] for c in cols) for r in df.select(*cols).collect())


def assert_rows_equal(actual, expected):
    """Raise an AssertionError that lists the rows that are missing and the rows that are unexpected."""
    a, e = Counter(actual), Counter(expected)
    missing, unexpected = e - a, a - e
    if missing or unexpected:
        lines = ["rows differ:"]
        lines += [f"  missing    {r!r}" for r in sorted(missing, key=repr)]
        lines += [f"  unexpected {r!r}" for r in sorted(unexpected, key=repr)]
        raise AssertionError("\n".join(lines))
