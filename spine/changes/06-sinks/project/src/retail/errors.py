"""The line of a Spark error a person reads: its class and first sentence."""
import re


def reason(error: Exception) -> str:
    found = re.search(r"\[[A-Z_.]+\][^\n]*", str(error))
    line = found.group(0) if found else str(error).strip().splitlines()[0]
    return re.split(r"(?<=[.?])\s", line, maxsplit=1)[0]
