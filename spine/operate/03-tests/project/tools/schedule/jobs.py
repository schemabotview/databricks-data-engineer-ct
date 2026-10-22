"""A MODEL of the documented Lakeflow Jobs rules. It is not Databricks Jobs.

A task runs when its upstream tasks allow it (its run_if); otherwise it is
SKIPPED, or EXCLUDED when a condition task said no. A repair runs again only
what did not succeed. The task bodies are real Spark, writing real tables.
"""
from dataclasses import dataclass, field


@dataclass
class Task:
    key: str
    body: object                                # a function of the run
    after: list = field(default_factory=list)   # keys, or (key, outcome)
    run_if: str = "ALL_SUCCEEDED"               # or "AT_LEAST_ONE_FAILED"
    retries: int = 0


def run(tasks, ctx, prior=None):
    """One run of the job; with `prior`, a REPAIR that keeps what succeeded."""
    done = dict(prior or {})
    for task in tasks:
        if done.get(task.key) == "SUCCEEDED" and prior:
            continue
        ups = []
        for dep in task.after:
            key, want = dep if isinstance(dep, tuple) else (dep, None)
            said_no = want is not None and ctx["outcome"].get(key) != want
            ok = done[key] == "SUCCEEDED"
            ups.append("EXCLUDED" if ok and said_no else done[key])
        if task.run_if == "ALL_SUCCEEDED":
            go = all(state == "SUCCEEDED" for state in ups)
        else:
            go = "FAILED" in ups
        if not go:
            excluded = "EXCLUDED" in ups and "FAILED" not in ups
            done[task.key] = "EXCLUDED" if excluded else "SKIPPED"
            continue
        for attempt in range(task.retries + 1):
            try:
                ctx["ran"].append(task.key)
                task.body(ctx)
                done[task.key] = "SUCCEEDED"
                break
            except RuntimeError as error:
                done[task.key] = "FAILED"
                ctx["log"].append(f"{task.key} attempt {attempt + 1}: {error}")
    return done
