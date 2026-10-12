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
| 8–11 | `orchestration` … `integration` | 30 | no | — |
