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
**published packages pinned by version** (flow ^2.2.0, shell ^0.13.1). This repo's own surface is
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
| 3 | `start` | Start the project | 6 | planned |
| 4 | `govern` | Govern it | 7 | planned |
| 5 | `tables` | Make the table reliable | 8 | planned |
| 6 | `ingest` | Bring the data in | 9 | planned |
| 7 | `transform` | Build silver and gold | 8 | planned |
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
chapters (customer updates, reference data); do not change these numbers.

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
npm run build && npx tsc --noEmit && npm run check
```

`check-render.mjs` launches Chrome; as root (a container) it passes `--no-sandbox`, and
`PUPPETEER_EXECUTABLE_PATH` picks the browser if puppeteer has none of its own. From Course 3,
`npm run check:spine` joins them. All are a **floor, not proof** — they pass on frames that are
visually wrong. The rendered route is the real bar, and the owner reviews it.

## Working agreement

- **Author the whole unit, then hand over the route.** Scenes, spine steps and narration together.
- **No ASCII sketches of scenes.** A sketch cannot show what the layout engine will do, which is the
  only thing worth looking at.
- **No silent scaffolding**, no work outside the ask. Say plainly what was built, what was verified,
  and what was left out.
