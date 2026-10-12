# retail_etl (course example)

The Chapter 5 order transformations, packaged the way Chapter 10 describes: pure functions in `src/`, tests in
`tests/`, a wheel for the job, and a bundle (`databricks.yml`) that declares where it deploys.

```sh
python -m venv .venv && .venv/bin/pip install "pyspark==4.0.1" "pytest>=8" -e .
.venv/bin/pytest            # unit, integration and data-quality tests; local PySpark, no workspace
```

The bundle files are **documented, not validated**: `databricks bundle validate` needs a workspace to authenticate against.
