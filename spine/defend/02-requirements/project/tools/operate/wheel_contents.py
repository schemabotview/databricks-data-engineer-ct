"""What the wheel carries, and what it leaves to the runtime."""
import zipfile
from pathlib import Path

wheel = next(Path("dist").glob("*.whl"))
with zipfile.ZipFile(wheel) as z:
    names = z.namelist()
    meta = next(n for n in names if n.endswith("METADATA"))
    points = next(n for n in names if n.endswith("entry_points.txt"))
    print(wheel.name)
    print("code:", ", ".join(n.split("/")[-1] for n in names
                             if n.startswith("retail/")))
    requires = [line.split(": ", 1)[1]
                for line in z.read(meta).decode().splitlines()
                if line.startswith("Requires-Dist")]
    print("requires:", ", ".join(requires) or "nothing")
    print("not required: pyspark, delta-spark — the runtime provides them")
    print("entry points:", ", ".join(
        line.split(" =")[0] for line in z.read(points).decode().splitlines()
        if "=" in line))
