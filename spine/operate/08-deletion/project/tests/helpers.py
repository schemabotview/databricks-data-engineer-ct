"""Compare rows as sets, and say exactly which rows differ."""


def rows(df, *columns):
    return sorted(tuple(r) for r in df.select(*columns).collect())


def assert_rows_equal(actual, expected):
    missing = sorted(set(expected) - set(actual))
    unexpected = sorted(set(actual) - set(expected))
    if missing or unexpected:
        raise AssertionError("rows differ:" + "".join(
            [f"\n  missing    {r}" for r in missing] +
            [f"\n  unexpected {r}" for r in unexpected]))
