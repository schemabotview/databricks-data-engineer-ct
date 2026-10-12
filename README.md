# databricks-data-engineer-ct

A [GraphL](https://graphl.in) content repo for **Databricks Data Engineering — From Platform Foundations
to Advanced Application**: 11 courses (one per chapter), 86 sections, authored from
[`docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md`](docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md) with the
[content-repo-template](https://github.com/schemabotview/content-repo-template) scaffold.

A **section** is `(scene, slide, narration)`: a declarative diagram or code card on the left, a markdown
slide on the right, and a narration script that becomes one segment of the course video. Routes are
`#/<course>-<section>`, e.g. `#/foundations-first-query`.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build && npx tsc --noEmit && npm run check
npm run shot -- /tmp/shots foundations-first-query   # render at 1920×1080 (set CHROMIUM=<chrome binary>)
```

`npm run check` enforces the layout budgets **and** conformance to the course plan (titles verbatim,
authored/planned counts per chapter). Both pass on visually wrong frames, so the rendered route is the
real bar. See `CLAUDE.md` for the authoring contract and the status of each chapter.

## Sources and research status

The plan's reference surface is **Databricks on AWS documentation** (researched 2026-10-11 and
2026-10-12): the [data-engineering overview](https://docs.databricks.com/aws/en/data-engineering),
[Unity Catalog](https://docs.databricks.com/aws/en/data-governance/unity-catalog/),
[Delta Lake](https://docs.databricks.com/aws/en/delta/),
[Auto Loader](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/),
[Lakeflow pipeline concepts](https://docs.databricks.com/aws/en/ldp/concepts),
[Lakeflow Jobs](https://docs.databricks.com/aws/en/jobs/) and
[Declarative Automation Bundles](https://docs.databricks.com/aws/en/dev-tools/bundles/). Book comparisons
(*Delta Lake: The Definitive Guide*, 2024; *Learning Spark*, 2nd ed.) used publisher contents only.

**Authoring-time limits, stated plainly**

- No Databricks workspace was available. Examples that need the platform (Unity Catalog, Auto Loader,
  pipelines, jobs, bundles, Photon, serverless) are *documented, not executed*.
- `docs.databricks.com` was not directly reachable from the authoring environment, so platform
  statements were limited to well-established concepts and cross-checked through search summaries only.
  **Re-verify each platform claim against the live docs before publishing.**
- Spark and Delta behaviour was run locally on PySpark 4.0.1 + Delta Lake 4.0.0 (`scripts/verify/`), not on a
  Databricks Runtime, so file and task counts may differ on the platform.
- No narration audio exists; `.wav` files come only from the Colab + Chatterbox pass.

## Review tracking

| Chapter | Course id | Sections | Authored | Owner review |
| --- | --- | --- | --- | --- |
| 1 Platform Foundations and a First Data Flow | `foundations` | 6 | yes | pending |
| 2 Governed Data and Unity Catalog | `governance` | 7 | yes (documented, not run) | pending |
| 3 Delta Tables and Reliable Data Changes | `delta-tables` | 8 | yes (local run) | pending |
| 4 Ingestion and Incremental Arrival | `ingestion` | 9 | yes (local file stream; Databricks sources documented) | pending |
| 5 Transformations and Business Data Products | `transformations` | 8 | yes (local run) | pending |
| 6 Streaming, CDC, and Changing State | `streaming-cdc` | 10 | yes (local run) | pending |
| 7 Declarative Data Pipelines | `pipelines` | 8 | yes (documented, not run) | pending |
| 8 Orchestration and Workload Dependencies | `orchestration` | 7 | yes (documented; local model) | pending |
| 9 Performance, Layout, and Cost | `performance` | 8 | yes (local counts; platform features documented) | pending |
| 10 Development, Deployment, and Operations | `operations` | 10 | yes (real example project; bundles documented) | pending |
| 11 Integrated Engineering Decisions | `integration` | 5 | yes (local run; platform features documented) | pending |

**Status: all 11 chapters (86 sections) are authored and await owner review.** `npm run check` reports 86 of 86 planned
sections with their plan titles verbatim; the whole course renders at 1920×1080 with no page errors or clipping (83 routes
inside the density targets, 3 slightly sparse scenes that were reviewed and accepted).

## Verification scripts

Every number the course quotes comes from one of these, run on local PySpark 4.0.1 + Delta Lake 4.0.0 (not a Databricks
Runtime). Set up once with `python3 -m venv .venv && .venv/bin/pip install "pyspark==4.0.1" "delta-spark==4.0.0" "pandas<3" pytest`
(Java 17/21 and PyPI/Maven Central access needed), then run `.venv/bin/python scripts/verify/<script>` from the repo root.

| Script | Chapter | What it proves | Tier |
| --- | --- | --- | --- |
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
