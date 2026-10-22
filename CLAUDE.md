# CLAUDE.md — databricks-data-engineer-ct

> The workspace-level `CLAUDE.md` (one level up, in `graphl-workspace`) holds the invariants that
> span every repo. This file is only what is true *here*.

## What this repo is

The GraphL concept app for **Databricks Data Engineering — from platform foundations to a production
design**: one course path built around one spine project (`retail-lakehouse`, a retail chain's
lakehouse laid out as a Databricks bundle) shown in real code. A **section** is `(scene, narration)` —
one full-screen frame and one segment of the course video. Sections are **scene-only** (no `slide`).

`docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md` is the source of truth for scope, audience, courses,
sections, the spine and the run/documented tier of every section. Author from it; do not drift from
its section lists. The method is `apache-spark-ct`'s, applied to the platform.

The render engine is `@graphlearning/flow`; the app shell is `@graphlearning/shell`. Both are
**published packages pinned by version** (flow ^2.2.0, shell ^0.14.0 — the first release that leaves
a section frame headerless and exports `SCENE_ASPECT`). This repo's own surface is
`src/content/`, `src/scenes/`, `src/main.tsx`, `src/theme.css` and (from Course 3) `spine/` — plus
`scripts/verify/` and `examples/retail_etl/`, the previous course's evidence, kept until the spine
replays the numbers they assert.

## Route contract

- Slug **`databricks-data-engineer-ct`** — the vite `base`, the path under `graphl.in`, and the GitHub
  repo name. All three must be the same string. (If the repo is renamed, change all three.)
- `#/` is the catalog. A section is `#/<courseId>-<sectionId>`, e.g. `#/why-databricks-bronze-silver-gold`.
- `?capture=1` and `window.__scene.plan()` are the recorders' hooks and come from the shell.
- Audio: `public/audio/<courseId>/<sectionId>.wav`. Section ids are unique within a course; scene ids
  are unique across the whole repo. Eyebrow `DATABRICKS`.
- Brand `--brand: #FF3621` (Databricks red-orange).

## Course arc and status

**Reset on 2026-10-21**: every course, scene, slide and wav of the previous 11-chapter, slide-based
course was deleted, and the subject re-planned as 13 courses, 97 sections, named by what we build.
The plan maps every old section to its new place, so no topic was dropped. Courses are authored one
at a time, each reviewed by the owner on its rendered routes before the next begins. A course is
registered in `src/content/index.ts` / `src/scenes/index.ts` only once authored.

| # | Course id | Course | Sections | Status |
| --- | --- | --- | --- | --- |
| 1 | `why-databricks` | Why a platform | 5 | authored, awaiting owner review (no narration audio yet) |
| 2 | `how-databricks-runs` | How the platform runs your code | 6 | authored, awaiting owner review (no narration audio yet) |
| 3 | `start` | Start the project | 6 | authored, awaiting owner review (no narration audio yet) |
| 4 | `govern` | Govern it | 7 | authored, awaiting owner review (no narration audio yet) |
| 5 | `tables` | Make the table reliable | 8 | authored, awaiting owner review (no narration audio yet) |
| 6 | `ingest` | Bring the data in | 9 | authored, awaiting owner review (no narration audio yet) |
| 7 | `transform` | Build silver and gold | 8 | authored, awaiting owner review (no narration audio yet) |
| 8 | `changes` | Handle change | 10 | planned |
| 9 | `pipelines` | Declare the pipeline | 8 | planned |
| 10 | `schedule` | Schedule it | 7 | planned |
| 11 | `fast` | Make it fast and cheap | 8 | planned |
| 12 | `operate` | Ship and operate it | 10 | planned |
| 13 | `defend` | Defend the design | 5 | planned |

Course 1 is concept frames. Its §4 tables are the Chapter 1 local run
(`scripts/verify/ch01_foundations.py`) and its §5 gold table the Chapter 5 run
(`ch05_transformations.py`); both were re-run on 2026-10-21 and pass.

Course 2 is documented concept frames with two local runs, both from
`scripts/verify/c02_how_databricks_runs.py`: the stack's versions (§4) and what a local session cannot do
(§5) — a three-part name fails with `[REQUIRES_SINGLE_PART_NAMESPACE]`, and `GRANT` is
`[INVALID_STATEMENT_OR_CLAUSE]`. No prices, start-up times or Runtime-to-Spark version mapping are quoted.

Course 4 is documented concept frames with two spine steps: `govern/03` drops a managed and an external
Delta table locally (the managed folder goes, the external one stays and still reads 8 rows), and `govern/04`
runs `tools/grant_matrix.py`, a MODEL of the documented grant rules that reads `governance/grants.sql` (finance
reads gold only; engineers bronze + silver; `retail-job` reads bronze + silver, writes silver; finance reading
silver lacks USE SCHEMA and SELECT). Course 10 reuses the model for the job's refused write to gold.

Course 5 is eight local runs, one per section, each a `tools/delta/*.py` script on its own `lab.*` table
(so they never touch the spine's bronze/silver/gold): the log's actions per version, a refused concurrent
append (o1 ends 41.00 COMPLETED), four refused writes then `mergeSchema`, UPDATE / DELETE / MERGE and a
refused duplicate-key MERGE, history and a RESTORE that adds version 6, VACUUM making version 1 unreadable,
the change feed (and DELTA_MISSING_CHANGE_DATA before it was enabled), and each table's protocol versions.
The frozen Course 5 facts hold except where a script says otherwise on screen; file counts are never quoted.

Course 6 has five spine steps and four documented frames. Run: a plain batch append loaded twice (8 then 16
rows, 7 order ids), `retail.bronze.ingest()` over the arrival timeline (3, 6, 6, 8; 16 with the checkpoint
deleted), schema drift (a fixed schema reads `"12,50"` as 1250.00 and drops `channel`), the three parse modes
(8 rows = 7 parsed + 1 quarantined), and the bronze reconciliation (8 rows, 7 order ids). Documented, not
run: COPY INTO, Auto Loader (`cloudFiles`), Lakeflow Connect, Kafka; the local runs use Spark's file stream
source, which the frames say is the analogue, not Auto Loader.

Course 7 is eight spine steps over bronze after files a–d have landed (`setup` lands them and ingests). The
frozen Course 7 numbers are reproduced: 11 = 6 silver + 1 identical resend + 1 superseded o6 + 3 quarantined;
gold Leeds 3 / 75.00, York 1 / 15.00, Hull 1 / 80.00 = 170.00; join inflation 5 rows / 170.00 against 6 /
185.00. One deviation from the old chapter, said on screen: bronze has no `event_ts`, so "latest" is the
newest landing file (`source_file` descending), which is deterministic because file names sort by arrival.
`retail.silver`, `retail.quality`, `retail.gold` and `retail.run` are the project's modules from here on.

## The spine: code is executed, not pasted

From Course 3 on, every code and terminal pane comes from `spine/<course>/<step>/`: `project/` is a
snapshot of `retail-lakehouse/` at that step, `session.txt` is the terminal transcript, `step.json` says
where it starts, whether a venv exists, which `setup` commands run silently first (the editable install,
the sample table a step queries), and which generated files to `capture`. Scenes import these files with
Vite's `?raw`, so a frame can only show what was replayed. `npm run check:spine` (`scripts/spine.py`,
apache-spark-ct's replayer) replays every step in a fresh copy and fails on any difference; `--write`
regenerates the transcripts after an edit, and a path prefix (`python3 scripts/spine.py start/04`) limits
it. Paths are normalised to `/home/ana/retail-lakehouse`. **Run it with Python 3.13 as `python` and Java
17 or 21 as `java` on PATH**, one replay at a time.

What is Delta-specific in the replay (all of it about the machine, never the code):

- **PySpark 4.0.1 and delta-spark 4.0.0 are installed once** into `.spine-cache/` (from
  `spine/requirements.txt`) and borrowed by each step's fresh `.venv` through a `.pth` file. `start/02`
  types its `pip install` and runs it for real.
- **Delta's jars come through Ivy.** `configure_spark_with_delta_pip` adds them to
  `spark.jars.packages`; a learner's first run downloads them into `~/.ivy2.5.2`, every later run finds
  them there. The replay is a later run: `warm_ivy` resolves them once. Java takes its home from the
  password file, not `$HOME`, so that cache is the real user's, shown as `/home/ana/.ivy2.5.2`.
- **Ivy prints a ~27-line resolution report on every start** — Spark silences it only in its own tests
  (`MavenUtils` sets `quiet` only when `isTest`); there is no setting. Its run id is a UUID (masked even
  when the 84-column wrap splits it) and its timings (`182ms`, `0kB/5ms`) are masked in every step.
  Course 3 §3 shows the report and explains it; every later frame folds the JVM notice and the report to
  one line with `quietIvy()` (`src/scenes/start/ivy.ts`).
- **A catalog that outlives the run**: `build_session()` calls `enableHiveSupport()`, so names live in a
  local Derby metastore (`metastore_db/`, `derby.log`) and tables in `spark-warehouse/` — the local
  stand-in for Unity Catalog. The project's `conf/log4j2.properties` silences `HiveExternalCatalog`'s
  warning that the Hive metastore does not know Delta (printed on every CREATE), and
  `spark-defaults.conf` raises `spark.sql.debug.maxToStringFields` so Delta's wide plans print without a
  truncation warning.
- **Code lines stay within 80 columns** — the editor is 80 wide, and a longer line widens it.

IDE frames are built with `ideFrame()` in `src/scenes/ide.ts`: apache-spark-ct's template, unchanged —
explorer (300) | editor (80 columns × 18 rows, 467) over terminal (17 lines) | side pane (520), 1632 wide
and `1632 / SCENE_ASPECT` tall, so 16:9 and fitted edge to edge now that a section has no header. A file
longer than 18 rows is folded with `show`; a run longer than 17 lines with `fold(session, …)`. A side
card wider than 520 widens the column and moves every panel — `check-render.mjs` fails any IDE frame
whose explorer, editor, terminal or side pane moves.

## Verification notes (read before trusting a number or a claim)

There is **no Databricks workspace** in the authoring environment, and `docs.databricks.com` is not
reachable from it. So every frame is in a tier, and says so on screen:

1. **Run.** Spark SQL / PySpark / Delta / Structured Streaming behaviour that needs no platform, on
   **PySpark 4.0.1 + Delta Lake 4.0.0, `local[2]`**, Python 3.13, OpenJDK 21 — the same stack as
   `apache-spark-ct`, not a Databricks Runtime. Every output on screen is what that run printed. File
   counts and task counts depend on partitioning and may differ on Databricks.
2. **Documented, not run.** Unity Catalog grants and locations, COPY INTO, Auto Loader, Lakeflow
   Connect, declarative pipelines, Jobs, bundles, Photon, serverless, predictive optimization, system
   tables. Checked through search summaries of the Databricks on AWS docs; record the runtime /
   compute / feature requirement each one needs. Do not assume cloud parity or feature availability.
   No preview feature in baseline examples. **Re-verify against the live docs before publishing.**
3. **Model.** A documented rule reproduced as arithmetic or a small program with real Delta effects;
   it proves nothing about the platform, and the frame says so.
4. **Illustrative.** Event logs, UI excerpts, cost tables. Never quote prices.

**Names**: run code uses two-part names (`silver.orders`), documented code Unity Catalog's three-part
names (`retail.silver.orders`); Course 2 §5 and Course 4 §1 explain the gap.

Running the old evidence scripts: `python3 -m venv .venv && .venv/bin/pip install "pyspark==4.0.1"
"delta-spark==4.0.0" "pandas<3" pytest`, then `env -u JAVA_TOOL_OPTIONS .venv/bin/python
scripts/verify/<script>` (Delta's jars come from Maven Central on first run). Nothing claims verified
individual mastery, and nothing equates finishing a course with competence.

## Frozen facts — the numbers frames quote

These were measured by the previous course's scripts and are kept verbatim; the new courses quote them.
Extend them in later courses; do not change them.

### The recurring example (Course 1 `why-databricks` §4, Course 3 `start`)

Retail orders. **Chapter 1 sample** (`bronze_orders`, 8 raw rows, all columns text):
`o1 7 40.00 COMPLETED · o2 7 25.00 COMPLETED · o3 9 60.00 CANCELLED · o4 9 15.00 COMPLETED ·
o5 12 80.00 COMPLETED · o6 7 10.00 PENDING · o4 resent (identical) · o7 9 "n/a" COMPLETED`.
Silver (`silver_orders`) = 6 typed unique rows (o4 merged, o7 rejected); gold (`gold_sales`) = completed
sales per store, `7 → 2 orders 65.00 · 9 → 1 15.00 · 12 → 1 80.00`, total **160.00**; reconciliation
**8 = 6 + 1 resend + 1 rejected**; first query returns CANCELLED 1 / COMPLETED 6 / PENDING 1, but only
**4** distinct valid completed orders. Same six-order core as `apache-spark-ct`. Extend it in later
chapters (order changes, reference data); do not change these numbers.

### Course 5 `tables` (was Chapter 3; local run)

Table `orders` (the silver table; typed): v0 CREATE, v1 six rows (o1..o6; o3 CANCELLED, o6 PENDING),
v2 INSERT o8 (12, 20.00, PENDING), v3 UPDATE o6 → COMPLETED, v4 DELETE o3, v5 MERGE (o8 → COMPLETED,
o9 (9, 45.00) inserted), v6 RESTORE to v4. Row counts per version `0, 6, 7, 7, 6, 7`; restore leaves 6.
Side tables: `orders_c` (contract), `orders_race` (conflict: o1 ends 41.00 COMPLETED), `ret` (VACUUM),
`feed` (change feed), `late`. File counts depend on partitioning — never quote them. NOT NULL had to
be declared at CREATE (the local Delta refused `ALTER ... SET NOT NULL`).

### Course 6 `ingest` (was Chapter 4; local run)

Three landing CSVs (header `order_id,store_id,amount,status`): a = o1, o2, o3; b = o4, o5, o6; c = o4
(resent), o7 (amount `n/a`). Arrival timeline with one checkpoint: **3, 6, 6, 8**; a deleted checkpoint
re-reads everything (**16**). 8 rows, **7** distinct `order_id`. Drift demo: JSON `1.json` (normal) and
`2.json` (amount `"12,50"`, new field `channel`); a fixed schema drops `channel` and parses `"12,50"` as
**1250.00** with no flag. Local analogue only: Spark's file stream source, not Auto Loader.

### Course 7 `transform` (was Chapter 5; local run)

`bronze_events`, 11 text rows (columns `order_id, store_id, amount, status, event_ts, source_file`): the three
landing files of Chapter 4 plus file d (`o6` COMPLETED 09:41, `o8` amount -5.00, `o9` unknown store 15).
Reference `stores` = 7 Leeds, 9 York, 12 Hull (`stores_dup` repeats York). Quality rules: amount readable
(fails o7), amount positive (o8), store known (o9). **11 = 6 silver + 1 identical resend + 1 superseded o6 +
3 quarantined.** `silver_orders` (6): o1 7 40.00 · o2 7 25.00 · o3 9 60.00 CANCELLED · o4 9 15.00 · o5 12 80.00
· o6 7 10.00 (all COMPLETED unless noted). `gold_sales`: Leeds 3 / 75.00, York 1 / 15.00, Hull 1 / 80.00 —
total **170.00** (Chapter 1's 160.00 had o6 still PENDING). Join inflation: 5 rows / 170.00 vs 6 rows / 185.00.

### Course 8 `changes` (was Chapter 6; local run)

Streaming input: four JSON files, ten order events, **one file per batch**, file mtimes set explicitly (Spark
reads oldest-first; equal times make the order arbitrary — the first attempt got batches in the wrong order).
f1 o1 09:01 40, o2 09:04 25, o4 09:14 15 · f2 o5 09:17 80, o6 09:23 10, o4 resent · f3 o10 09:06 30 (late),
o11 09:31 20 · f4 o12 09:02 5 (very late), o13 09:44 50. 10-minute windows, 10-minute watermark: batch
watermarks none / 09:04 / 09:13 / 09:21 / 09:34; windows written 09:00 = 95.00, 09:10 = 110.00 (the resend is
counted twice: no dedupe), 09:20 = 10.00; o12 dropped, o10 counted. Payments p1–p4 for the join demo.
CDC feed: 8 records in 3 arrival batches over o1/o2/o3 (see `cdc-feed`). The change feed is **configured**
(`delta.enableChangeDataFeed = true`); automatic feeds on eligible tables are NOT tested — never claim them.

### Course 9 `pipelines` (was Chapter 7; DOCUMENTED, NOT RUN)

No Databricks workspace and `docs.databricks.com` unreachable: names were checked through search summaries
of the docs. Used: `from pyspark import pipelines as dp` (the module was `dlt`); `CREATE OR REFRESH STREAMING
TABLE`, `CREATE OR REFRESH MATERIALIZED VIEW`, `CREATE TEMPORARY VIEW`; `CREATE FLOW ... AS AUTO CDC INTO ...
KEYS (...) SEQUENCE BY ... STORED AS SCD TYPE 1|2` (older: `APPLY CHANGES INTO`); expectations warn / drop /
fail (metrics only for warn and drop); SCD 2 adds `__START_AT` / `__END_AT`. **Unverified, re-check before
publishing:** `SEQUENCE BY STRUCT(...)` for tie-breaking, the event-log schema, `pipelines.reset.allowed`,
selective/full refresh wording, sinks. Illustrative tables are labelled as such. Local and real: the policy
arithmetic (11 kept under warn, 8 under drop) and the Delta streaming source refusing an UPDATE.

### Course 10 `schedule` (was Chapter 8; Jobs DOCUMENTED, NOT RUN; local model)

`scripts/verify/ch08_orchestration_model.py` is a **model** of the documented Jobs semantics (task states,
run-if, condition tasks, retry, repair vs full rerun) with **real Delta effects** — it proves nothing about the
platform. Frozen results: transform fails once → validate/publish SKIPPED, alert (run if at least one failed)
SUCCEEDED; repair keeps ingest (bronze 8, published 1 row of 160.00); a full rerun with an append ingest gives
bronze 16 (hidden downstream by DISTINCT), with a merge ingest 8; a publish that wrote then timed out and was
retried leaves 2 rows (append) or 1 (merge). Docs-confirmed through search summaries: repair re-runs
unsuccessful tasks, Jobs does not make tasks idempotent, run-if option list, `{{job.parameters.name}}`,
if/else and for-each tasks, trigger kinds. **Unverified:** task-values spelling, run-as wording, YAML field
names. Run-as refusal derives from the Chapter 2 permission model.

### Course 11 `fast` (was Chapter 9; local counts, NO timings anywhere)

One million hash-generated orders (`scripts/verify/ch09_performance.py`; OPTIMIZE target size lowered to 400 KB).
Checksum for every layout: **1,000,000 rows, sum(amount) 50,497,436.00**. Files opened by `store_id = 7`:
unclustered 24/24, compaction only 2/2, Z-order 1/19, liquid 1/19 (a `customer_id` filter: 19/19 on both),
date-partitioned 720/720. Partitioning an unsorted write: 720 files by date, 2,000 by customer. 128 files →
25 after OPTIMIZE. Join: default BroadcastHashJoin (1 shuffle) vs SortMergeJoin (3). Skew (80% on store 7),
largest of 4 partitions: 855,480 vs 319,925 even vs 299,626 salted 64 ways; REST task quantiles 36,115 /
43,880 / 64,525 / 855,480 / 855,480. 1,000 rows: 200 → 200 tasks, 4 → 4, AQE → 1. The **cost table is
hypothetical** (3 s per file, 2 machines, 1 unit/machine-hour, 24 runs/day → 0.96 / 0.08 / 0.04 / 28.80); only
files-read is measured. Documented via search summaries: predictive optimization (UC managed tables, OPTIMIZE /
VACUUM / ANALYZE, no Z-order, not all regions, default-on for accounts created from 2024-11-11), liquid
clustering replaces partitioning and Z-order, `CLUSTER BY AUTO` needs predictive optimization. **Photon
eligibility was not confirmed — keep it generic.**

### Course 12 `operate` (was Chapter 10; a REAL example project, documented bundles)

`examples/retail_etl/` is a real package (Chapter 5 logic as pure functions) with **7 passing tests** (4 unit,
1 integration, 2 data-quality), run on local PySpark: `PYTHONPATH=src pytest` from that folder (needs `pytest`).
`scripts/verify/ch10_operations.py` runs them, shows a deliberately buggy variant failing with the exact diff
(`missing ('o6','COMPLETED','orders-d.csv')` / `unexpected ('o6','PENDING','orders-b.csv')`), builds the wheel
(`retail_etl-0.1.0-py3-none-any.whl`, no pyspark dependency), and demonstrates deletion obligations (after DELETE the
old version, the change feed and a derived table — 100.00 stale, 35.00 after recompute — all still hold the data
until VACUUM and a recompute). Objectives (15 min, 95%) are illustrative; measurements are real (lag 30 min at a
fixed 10:20 clock; 8 of 11 = 72.7%). **`databricks.yml` and `resources/retail_daily.yml` are NOT validated**
(`bundle validate` needs a workspace). Product name: **Declarative Automation Bundles** (older: Databricks
Asset Bundles). Confirmed via search summaries: targets, `mode: development|production`, `run_as`, `permissions`,
`system.billing.usage` with `custom_tags` / `usage_metadata.job_id`. **Unverified:** audit and lineage system-table
names, secret redaction wording, the expired-credential error shape, the CI sketch.

### Course 13 `defend` (was Chapter 11; local run reusing `examples/retail_etl`)

Base: 11 events → silver 6 → gold 170.00. **Correction** (`orders-e.csv`, o4 → 18.00 at 2026-10-02 08:00): York 18.00,
total **173.00**, silver still 6, o4 history = 15.00 [09:14, next day 08:00) then 18.00 open. **New source**
(`partner-1.csv`, store CODES LDS/YRK/HUL, p3 has the unknown code XXX): silver **8**, gold Leeds 4 / 105.00, York 2 /
30.00, Hull 1 / 80.00, total **215.00**, p3 quarantined (`unknown store`). Reconciliation **15 = 8 silver + 3 older
valid versions + 4 quarantined**. **Latency:** three micro-batches applying a MERGE guarded by `struct(event_ts,
source_file)` equal the full recompute. The critique and decision record cite earlier chapters' local results and
models; they claim nothing about Databricks. The final narration ends with the plan's bridge and claims no competence.

## Authoring conventions

- Teaching method per section: objective → mental model → annotated code / configuration and its real
  (or documented) result → failure or alternative contrast → bridge. Explain a term before relying on
  it; governance begins before data access; transaction semantics precede CDC; direct transformations
  precede declarative automation.
- **Author wide, not tall.** A scene is fitted to the 16:9 frame; lay concept frames out left to
  right, and give a tall chain `cols` or a row.
- **Fill the frame with content, not spacing**: real tables, real rows, worked numbers.
- **One idea per frame.** Narration is flowing prose and never reads code aloud line by line; every
  fact on a frame gets its sentence in the narration.
- Use **current API names**; label older DLT / Databricks Asset Bundles terminology only for
  recognition. Scope per the plan: no ML/AI, no comprehensive BI authoring, no cloud account/network
  administration, no certification prep.
- Reference `apache-spark-ct`, `python-ct` and `sql` for foundations rather than repeating them.
- **There is no `databricks` or `delta` brand mark** in the engine's icon set. Use `spark` for Spark,
  lucide `layers` for Delta, `cloud` for the platform.

## Scene inventory

| Scene id | Shape | Used by |
| --- | --- | --- |
| `data-product-consumers` | three consumer lists across → price-of-each-requirement table beside four-questions list | `why-databricks-what-a-data-product-owes` |
| `spark-delta-databricks` | engine → table format → platform lists in a row → which-layer-answers table | `why-databricks-spark-delta-databricks` |
| `lakehouse` | lake + warehouse chain beside the lakehouse chain → what-changes table over does-not-remove list | `why-databricks-the-lakehouse` |
| `bronze-silver-gold` | bronze (8) → silver (6) → gold (160.00) tables → reconciliation beside where-guarantees-come-from table | `why-databricks-bronze-silver-gold` |
| `retail-lakehouse` | sources → Delta tables → consumers, over how-it-runs and around-the-project bands | `why-databricks-what-we-will-build` |
| `platform-planes` | control plane → classic / serverless compute → your storage → who-holds-what table beside what-it-means list | `how-databricks-runs-control-and-compute-planes` |
| `account-boundaries` | account (identities → metastore with two workspaces and two bound catalogs) beside boundaries table and easy-to-get-wrong list | `how-databricks-runs-accounts-workspaces-metastores` |
| `compute-choices` | kinds-of-compute table → provisional retail choice table beside words list | `how-databricks-runs-compute-choices` |
| `databricks-runtime` | Runtime release list beside the local stack's versions (run) → runs-the-same table | `how-databricks-runs-the-databricks-runtime` |
| `query-path` | four documented UC steps in a row → local names and errors (run) beside where-each-answer-comes-from table | `how-databricks-runs-a-querys-path` |
| `where-code-lives` | where-code-is-written table → notebook source card beside this course's choice | `how-databricks-runs-where-code-is-written` |
| `project-tour` | IDE: finished tree, parts-and-courses table in the editor's place, reading-every-lesson list | `start-the-finished-project` |
| `new-project` | IDE: requirements.txt (captured), venv + pip + java session | `start-a-new-project` |
| `delta-session` | IDE: src/retail/session.py, Ivy's report shown and explained | `start-a-session-that-speaks-delta` |
| `first-table` | IDE: tools/load_sample.py, the table's folder and its log's actions | `start-the-first-table` |
| `first-query` | IDE: tools/first_query.py, SQL and PySpark agreeing (1 / 6 / 1) | `start-the-first-query` |
| `notebook-source` | IDE: notebooks/explore.py run as a script (8 rows, 7 ids, 4 valid completed) | `start-notebook-source` |
| `uc-names` | metastore → catalogs → schemas → objects in a row → names.sql beside the platform-to-local name table | `govern-three-part-names` |
| `tables-views-volumes` | securables table → tabular and volume code cards → privileges table beside which-one list | `govern-tables-views-volumes` |
| `managed-external` | IDE: tools/drop_demo.py, DROP removes the managed folder and keeps the external one (run) | `govern-managed-and-external` |
| `grants` | IDE: governance/grants.sql (documented) with the model's matrix in the terminal | `govern-principals-and-privileges` |
| `storage-locations` | IAM role → credential → location → table → location.sql beside three-controls table and list | `govern-storage-credentials-and-locations` |
| `lineage-audit` | lineage chain → lineage query beside evidence-kinds table and an illustrative result | `govern-discovery-lineage-audit` |
| `share-federate` | ingest / share / federate lists → trade table beside ask-first list | `govern-sharing-and-federation` |
| `delta-versions` | IDE: tools/delta/versions.py, the actions in each commit and the rows each version reads | `tables-files-log-snapshots` |
| `write-conflict` | IDE: tools/delta/conflict.py, writer A refused after writer B commits | `tables-acid-and-concurrent-writes` |
| `schema-contract` | IDE: tools/delta/contract.py, four refused writes then a declared evolution | `tables-schema-enforcement` |
| `dml-merge` | IDE: tools/delta/changes.py, UPDATE / DELETE / MERGE and a refused ambiguous MERGE | `tables-dml-and-merge` |
| `history-restore` | IDE: tools/delta/history.py, history, time travel and RESTORE as a new version | `tables-history-and-restore` |
| `vacuum` | IDE: tools/delta/vacuum.py, which versions stay readable after VACUUM | `tables-retention-and-vacuum` |
| `change-feed` | IDE: tools/delta/change_feed.py, row-level changes with their commit versions | `tables-change-data-feed` |
| `table-features` | IDE: tools/delta/features.py, the protocol each lab table now demands | `tables-table-features` |
| `source-contracts` | five-questions list → the three sources answered table beside why-ask list | `ingest-source-contracts` |
| `batch-load` | IDE: tools/ingest/batch_twice.py, a plain append run twice doubles bronze; COPY INTO beside it | `ingest-batch-loads` |
| `auto-loader` | Auto Loader code (documented) → what-it-adds table beside the local analogue | `ingest-auto-loader` |
| `file-progress` | IDE: src/retail/bronze.py, five ingest runs and the checkpoint's folders | `ingest-file-discovery-and-checkpoints` |
| `schema-drift` | IDE: tools/ingest/drift.py, a fixed schema quietly wrong, inference widening to string | `ingest-schema-inference-and-drift` |
| `malformed-records` | IDE: tools/ingest/malformed.py, PERMISSIVE / DROPMALFORMED / FAILFAST and the quarantined row | `ingest-malformed-records` |
| `managed-connectors` | who-does-what table → before-choosing, still-yours and ask-first lists | `ingest-managed-connectors` |
| `message-bus` | Kafka read (documented) → offsets → files-against-a-bus table beside assumptions | `ingest-message-buses` |
| `bronze-walkthrough` | IDE: tools/ingest/reconcile.py, source to bronze counted per file | `ingest-bronze-walkthrough` |
| `spark-model` | IDE: tools/transform/lazy.py, transformations build a plan and an action runs it | `transform-the-spark-you-need` |
| `sql-and-dataframes` | IDE: tools/transform/same_plan.py, SQL and PySpark compile to the same plan | `transform-sql-and-dataframes` |
| `types-nulls-time` | IDE: tools/transform/types_and_time.py, four ways to be quietly wrong | `transform-types-nulls-and-time` |
| `join-cardinality` | IDE: tools/transform/join_check.py, a duplicated key inflating gold (5 / 170.00 vs 6 / 185.00) | `transform-joins-and-cardinality` |
| `window-dedupe` | IDE: tools/transform/latest.py, row_number keeps the newest file's row | `transform-windows-and-deduplication` |
| `quality-quarantine` | IDE: src/retail/quality.py, rules as data and 11 events accounted for | `transform-quality-rules-and-quarantine` |
| `gold-contract` | IDE: src/retail/gold.py, the contract's columns, NOT NULLs and CHECK | `transform-gold-as-a-contract` |
| `silver-gold-flow` | IDE: src/retail/run.py, landed files to gold with detail = summary | `transform-the-silver-and-gold-flow` |

## Invariants — do not break

- **Never write `x` or `y`.** Scenes are declarative: nodes, edges, nesting. `computeLayout` is not
  exported, so there is no way around this, and that is the point — reproducible frames.
- **Do not reimplement the shell.** `SectionView`, `CourseIndex`, `SlidePanel` and the hooks are
  withheld on purpose. The route contract is what every recorder drives, and it holds only if every
  repo composes the pieces identically.
- **`SiteHeader` goes on the catalog page only** — never on a section. A section is a video frame.
- **Three stylesheets, in cascade order**, imported in `main.tsx`. The order is load-bearing:
  1. `@graphlearning/flow/styles.css` — the node styles plus the IBM Plex faces the engine is
     *calibrated* to (`codeMetrics` sizes code from a measured 9.02px glyph advance). Carries `.tok-*`.
  2. `@graphlearning/shell/styles.css` — the shell paints the canvas.
  3. `./theme.css` — this repo's three brand tokens. **Last, or the brand loses to the defaults.**
- **`file:../ui-flow` / `file:../ui-shell` must never be committed.** Local engine work only; CI has
  no sibling checkout.
- **Narration is never hand-produced.** `.tts` → `.wav` via Colab + Chatterbox only.

## Layout rules the frames actually care about

`npm run check` (`check-content.mjs` + `check-render.mjs`) catches silent failures — each builds
green and breaks only on screen:

- **Text that leaves its node is caught by rendering, not modelling.** Under flow 2.x cards grow to
  fit their text; `check-render.mjs` measures the real frame at 3840×2160. Unbreakable tokens are
  still the thing to watch — `_`, `.` and `/` are **not** break opportunities in CSS.
- **A `focus:` that names no node in its scene is a silent no-op** — nothing lights up.
- **A list is a framed card with bullets.** `framed` is inherited, so set it on the list's PARENT
  (or the scene). Only prose cards and lists read `framed`.
- **A `badge` renders on a CONTAINER only.** On a leaf it is silently dropped — put the number in the
  `sub` instead (`retail-lakehouse` does).
- **An edge label between two adjacent wide cards lands on their text.** Leave such edges unlabelled
  and say it in a `sub` (`bronze-silver-gold`, `spark-delta-databricks`).
- **`icon:` names are NOT guarded.** A wrong name type-checks, passes `check`, builds, and renders
  the pattern's default glyph. The engine's `icon-gallery` fixture lists every valid key. Avoid
  `monitor` and `users`: Azure tiles shadow those lucide names.
- **A section with no wav narrates silence** and records a silent segment. Audio resolves purely by
  convention: `public/audio/<course>/<section-id>.wav`.

What `check` does *not* model: an edge label landing on top of a card, or a frame that is too empty.
Look at the route.

## Guards before handing over

```sh
npm run build && npx tsc --noEmit && npm run check && npm run check:spine
```

`check-render.mjs` launches Chrome; as root (a container) it passes `--no-sandbox`, and
`PUPPETEER_EXECUTABLE_PATH` picks the browser if puppeteer has none of its own. `npm run check:spine`
replays the spine (needs network the first time: PyPI for `start/02`, Maven Central for Delta's jars). All are a **floor, not proof** — they pass on frames that are
visually wrong. The rendered route is the real bar, and the owner reviews it.

## Working agreement

- **Author the whole unit, then hand over the route.** Scenes, spine steps and narration together.
- **No ASCII sketches of scenes.** A sketch cannot show what the layout engine will do, which is the
  only thing worth looking at.
- **No silent scaffolding**, no work outside the ask. Say plainly what was built, what was verified,
  and what was left out.
