"""HYPOTHETICAL cost arithmetic on MEASURED files read. Not a price list.

Every input below is an assumption, except the files each layout opened
for `store_id = 7`, which tools/fast/layouts.py measured.
"""
SECONDS_PER_FILE = 3     # assumed: time to open and read one file
MACHINES = 2             # assumed: workers in the cluster
UNITS_PER_HOUR = 1       # assumed: cost units per machine-hour
RUNS_PER_DAY = 24        # assumed: an hourly job

MEASURED = {"no layout": 24, "compaction only": 2, "liquid clustering": 1,
            "partitioned by date": 720}

print(f"{'layout':21}{'files read':>11}{'units a day':>13}")
for layout, opened in MEASURED.items():
    hours = opened * SECONDS_PER_FILE * MACHINES / 3600
    units = round(hours * UNITS_PER_HOUR * RUNS_PER_DAY, 2)
    print(f"{layout:21}{opened:>11}{units:>13}")
print("assumed: 3 s a file, 2 machines, 1 unit a machine-hour, 24 runs a day")
