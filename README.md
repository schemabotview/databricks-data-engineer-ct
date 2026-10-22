# databricks-data-engineer-ct

A [GraphL](https://graphl.in) content repo for **Databricks Data Engineering — from platform
foundations to a production design**: 13 courses, 97 sections, built around one project
(`retail-lakehouse`) and authored from
[`docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md`](docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md).

A **section** is `(scene, narration)`: one full-screen frame and a narration script that becomes one
segment of the course video. There are no slides. Routes are `#/<course>-<section>`, e.g.
`#/why-databricks-bronze-silver-gold`.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build && npx tsc --noEmit && npm run check
npm run check:spine   # replay every spine step (Python 3.13 as `python`, Java 17/21)
```

`npm run check` is `check-content.mjs` (scene-only sections, narration, `focus`, wavs) and
`check-render.mjs` (every section at 3840×2160 under `?capture=1`, failing on text that leaves its
node). Both pass on visually wrong frames, so the rendered route is the real bar. See `CLAUDE.md` for
the authoring contract and the status of each course.

## Sources and research status

The plan's reference surface is **Databricks on AWS documentation** (researched 2026-10-11 and
2026-10-12): the [data-engineering overview](https://docs.databricks.com/aws/en/data-engineering),
[Unity Catalog](https://docs.databricks.com/aws/en/data-governance/unity-catalog/),
[Delta Lake](https://docs.databricks.com/aws/en/delta/),
[Auto Loader](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/),
[Lakeflow pipeline concepts](https://docs.databricks.com/aws/en/ldp/concepts),
[Lakeflow Jobs](https://docs.databricks.com/aws/en/jobs/) and
[Declarative Automation Bundles](https://docs.databricks.com/aws/en/dev-tools/bundles/).

**Authoring-time limits, stated plainly**

- No Databricks workspace is available. What needs the platform (Unity Catalog, Auto Loader,
  pipelines, jobs, bundles, Photon, serverless) is *documented, not run*, and labelled so on screen.
- `docs.databricks.com` is not reachable from the authoring environment, so platform statements are
  cross-checked through search summaries only. **Re-verify each platform claim against the live docs
  before publishing.**
- Spark and Delta behaviour is run locally on PySpark 4.0.1 + Delta Lake 4.0.0, not on a Databricks
  Runtime, so file and task counts may differ on the platform.
- No narration audio exists; `.wav` files come only from the Colab + Chatterbox pass.

## Review tracking

| # | Course id | Sections | Authored | Owner review |
| --- | --- | --- | --- | --- |
| 1 | `why-databricks` | 5 | yes (concept frames; §4–§5 numbers from a local run) | pending |
| 2 | `how-databricks-runs` | 6 | yes (documented concept frames; §4–§5 local runs) | pending |
| 3 | `start` | 6 | yes (IDE frames; every pane replayed by `npm run check:spine`) | pending |
| 4 | `govern` | 7 | yes (documented concept frames; §3 a local DROP run, §4 a model of the grants) | pending |
| 5 | `tables` | 8 | yes (every section a local Delta run on `lab.*` tables) | pending |
| 6 | `ingest` | 9 | yes (five local runs; COPY INTO, Auto Loader, connectors and Kafka documented) | pending |
| 7 | `transform` | 8 | yes (every section a local run over the spine's bronze) | pending |
| 8 | `changes` | 10 | yes (every section a local stream or CDC run) | pending |
| 9 | `pipelines` | 8 | yes (documented frames; §4 a model of expectations, §5 a local run) | pending |
| 10 | `schedule` | 7 | yes (the job documented; a local model of its rules with real Delta effects) | pending |
| 11 | `fast` | 8 | yes (local counts, no timings; compute and predictive optimization documented) | pending |
| 12 | `operate` | 10 | yes (five local runs: modules, wheel, 7 tests, objectives, deletion; bundles, CI, system tables documented) | pending |
| 13 | `defend` | 5 | yes (two local runs: changed requirements, micro-batches; the rest concept and documented) | pending |

## Evidence scripts (from the previous course)

The frozen numbers in `CLAUDE.md` come from one of these, and the new courses quote them until the spine (`spine/`, from Course 3) replays them. They are, run on local PySpark 4.0.1 + Delta Lake 4.0.0 (not a Databricks
Runtime). Set up once with `python3 -m venv .venv && .venv/bin/pip install "pyspark==4.0.1" "delta-spark==4.0.0" "pandas<3" pytest`
(Java 17/21 and PyPI/Maven Central access needed), then run `.venv/bin/python scripts/verify/<script>` from the repo root.

| Script | Old chapter | What it proves | Tier |
| --- | --- | --- | --- |
| `c02_how_databricks_runs.py` | new Course 2 | the local stack's versions; a three-part name and a GRANT failing locally | run locally |
| `ch01_foundations.py` | 1 | first query, bronze/silver/gold counts, on-disk Delta log | run locally |
| `ch02_governance_model.py` | 2 | the permission matrix follows from the grants | a model of the documented rules |
| `ch03_delta_tables.py` | 3 | versions, MERGE, constraints, a forced write conflict, RESTORE, VACUUM, change feed, protocol | run locally |
| `ch04_ingestion.py` | 4 | file-stream checkpoints, replay, PERMISSIVE parsing, schema drift (incl. `"12,50"` → 1250.00) | run locally (Spark file source, not Auto Loader) |
| `ch05_transformations.py` | 5 | plans, SQL/DataFrame equivalence, join inflation, deterministic dedupe, quality rules, gold contract | run locally |
| `ch06_streaming_cdc.py` | 6 | watermarks, state size, joins, restarts, replayed batches, sequence-guarded CDC, SCD1/2, change feed | run locally |
| `ch07_pipelines_local.py` | 7 | expectation-policy arithmetic; a Delta stream refusing a source UPDATE | local pieces only; pipelines documented |
| `ch08_orchestration_model.py` | 8 | repair vs full rerun vs retry, with real Delta effects | a model of the documented Jobs semantics |
| `ch09_performance.py` | 9 | files opened by layout, join plans, skew, task counts (counts only, no timings) | run locally |
| `ch10_operations.py` | 10 | the example project's tests, a bug diff, a built wheel, deletion obligations | run locally |
| `ch11_integration.py` | 11 | a correction, a new source and micro-batches against the full design | run locally |

`examples/retail_etl/` is a real package with its own tests (`PYTHONPATH=src pytest` from that folder). Its
`databricks.yml` and `resources/` are **documented, not validated**.
