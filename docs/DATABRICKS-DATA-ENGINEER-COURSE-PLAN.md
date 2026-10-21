# Databricks Data Engineering — from platform foundations to a production design

**Status: reset on 2026-10-21 and re-planned around one lakehouse project, built step by step.**
The previous plan's 11 slide-based chapters (86 sections) become 13 scene-only courses (97 sections);
every old section is kept, and the map from old chapter to new course is at the end. Courses are
authored one at a time, each reviewed by the owner on its rendered routes before the next begins.
No course of the new plan is authored yet. The previous course's narration audio is discarded with it.

## The idea

The course builds **one project — a retail lakehouse — from an empty folder to a governed, scheduled,
tested and monitored data product**, and every platform idea is taught at the moment the project
first needs it. Courses are named by **what we build**, not by product area, so the whole course is
one story a learner can hold in their head:

> *Why a platform → how it runs → start the project → govern it → make the table reliable → bring
> the data in → build silver and gold → handle change → declare the pipeline → schedule it → make it
> fast and cheap → ship and operate it → defend the design.*

| Part | For | Leaves you able to |
| --- | --- | --- |
| 0 — The picture (Courses 1–2) | everyone | say what the platform adds to Spark and Delta, and where code runs and data lives |
| I — Build it (Courses 3–7) | someone who knows basic SQL and Python | build a governed bronze → silver → gold flow on Delta tables |
| II — Keep it correct (Courses 8–10) | someone who can build the flow | keep it correct as data arrives late, changes and is replayed, under a pipeline and a job |
| III — Run it (Courses 11–13) | someone who owns the flow | measure it, deploy and operate it, and defend its design |

**Audience**: learners new to Databricks who can read SQL queries and Python functions and
collections. This is a platform-engineering course, independent of the Associate and Professional
certifications: no exam weights, practice questions or certification promise. Spark internals (plans,
AQE, the execution model) are the `apache-spark` course's subject and are referenced, not re-taught;
SQL and Python foundations are the `sql` and `python-ct` courses'.

**Out of scope**: ML/AI, comprehensive BI authoring, every connector and API option, cloud account and
network administration, certification preparation, full legacy-interface coverage. Sharing,
federation, visual authoring and other table formats get comparison-level coverage only. No preview
feature is essential to the core progression.

## The spine: `retail-lakehouse`

A retail chain's stores land **order files** in cloud storage; a CDC feed carries **customer
updates**; a small **store reference table** maps ids to cities. The project ingests them to
**bronze**, cleans and deduplicates them into **silver**, summarises completed sales per city and day
into **gold**, keeps customer history as SCD type 2, and runs as a scheduled job with tests, a bundle
and monitoring.

The project is laid out as a **Databricks bundle** from the first step, so the folder the learner
builds is the one they would deploy:

```
retail-lakehouse/
  .venv/                          PySpark + delta-spark, for the local runs         (3)
  requirements.txt                pyspark==4.0.1, delta-spark==4.0.0               (3 → 12)
  conf/log4j2.properties          Spark's logs at WARN, so the terminal is readable (3)
  databricks.yml                  the bundle: targets, variables                    (12)
  resources/retail_daily.yml      the job: tasks, schedule, run-as                 (10 → 12)
  resources/retail_pipeline.yml   the declarative pipeline                         (9)
  governance/grants.sql           catalogs, schemas, grants                        (4)
  data/landing/orders/            arriving order files                             (6)
  data/landing/customers_cdc/     the customer change feed                         (8)
  data/reference/stores.csv       store id → city                                  (7)
  src/retail/                     the package
    session.py                    one local SparkSession with Delta                (3)
    bronze.py                     land files as they arrived                       (6)
    silver.py                     parse, validate, deduplicate, enrich              (7)
    gold.py                       sales per city and day                            (7)
    quality.py                    the rules and the reconciliation                 (7 → 12)
    cdc.py                        sequence-guarded MERGE, SCD 1 and 2                (8)
  notebooks/explore.py            a notebook in source format                       (3)
  pipelines/retail.py             dataset definitions                               (9)
  tools/make_orders.py            1,000,000 generated orders                        (11)
  tests/                          unit, integration and data-quality tests          (12)
```

### The frozen numbers

The worked numbers stay fixed across the whole course; they are the numbers the previous course
already measured and published (see `CLAUDE.md`), and they share the six-order core with
`apache-spark`:

- **First sample** (`bronze_orders`, 8 raw rows, all text): o1 7 40.00 COMPLETED · o2 7 25.00
  COMPLETED · o3 9 60.00 CANCELLED · o4 9 15.00 COMPLETED · o5 12 80.00 COMPLETED · o6 7 10.00 PENDING ·
  o4 resent · o7 9 `"n/a"`. Silver 6, gold total **160.00**, **8 = 6 + 1 resend + 1 rejected**.
- **Delta versions** (Course 5): row counts per version `0, 6, 7, 7, 6, 7`; restore leaves 6.
- **Arrival** (Course 6): three landing files, counts **3, 6, 6, 8**; a deleted checkpoint re-reads
  everything (**16**); `"12,50"` read as **1250.00** under a fixed schema with no flag.
- **Silver and gold** (Course 7): 11 events, **11 = 6 silver + 1 resend + 1 superseded + 3
  quarantined**; gold Leeds 3 / 75.00, York 1 / 15.00, Hull 1 / 80.00, total **170.00**; a duplicated
  store row turns it into 185.00.
- **The stream and CDC** (Course 8): ten events in four files, 10-minute windows and watermark; eight
  CDC records over o1/o2/o3 in three batches.
- **Generated data** (Course 11): 1,000,000 orders, checksum sum(amount) **50,497,436.00**; file
  counts only, **no timings anywhere**.
- **Changed requirements** (Course 13): a correction makes the total **173.00**; a new partner source
  makes it **215.00**; **15 = 8 silver + 3 older versions + 4 quarantined**.

Money is a `DECIMAL(10,2)` from the moment a schema is declared.

## What runs, and what is documented

There is no Databricks workspace in the authoring environment, and `docs.databricks.com` is not
reachable from it. So every frame says which tier it is in, and the tier is visible on screen:

1. **Run.** Spark SQL, PySpark, Delta and Structured Streaming behaviour that needs no platform:
   Delta DML and MERGE, constraints, history, restore, VACUUM, the change feed, file-stream
   checkpoints, windows, watermarks, CDC merges, file layouts, tests and the wheel. Run on
   **PySpark 4.0.1 + Delta Lake 4.0.0** (`local[2]`, Python 3.13, OpenJDK 21) — the same stack as
   `apache-spark`, not a Databricks Runtime — and replayed by `npm run check:spine`. File and task
   counts depend on partitioning and may differ on the platform; the frame says so where it matters.
2. **Documented, not run.** Unity Catalog grants and locations, COPY INTO, Auto Loader, Lakeflow
   Connect, declarative pipelines (expectations, AUTO CDC, refresh), Jobs, bundles, Photon,
   serverless, predictive optimization, system tables. Shown as real files in the project (the
   editor opens `grants.sql`, `retail_daily.yml`, `databricks.yml`) with no terminal output, and
   labelled "documented, not run". Each records the runtime, compute or feature requirement it needs.
   **Re-verify each against the live docs before publishing.**
3. **Model.** Where a platform rule can be reproduced as arithmetic or a small program with real
   Delta effects (the permission matrix, expectation policies, repair against rerun), the model runs
   and the frame says it is a model of the documented behaviour, proving nothing about the platform.
4. **Illustrative.** Event logs, UI excerpts, cost tables. Labelled as such; prices are never quoted.

**Names.** Unity Catalog addresses a table with three parts (`retail.silver.orders`); open-source
Delta on a local session resolves two (`silver.orders`). Run code uses the two-part name, documented
code the three-part one, and Course 2 §5 and Course 4 §1 explain the gap once.

## Three kinds of frame

Every section is **one full-screen frame and one narration** (90–180 s), no slide.

1. **Concept frame** — a diagram: the control and compute planes, the catalog tree, a snapshot
   sequence, a watermark timeline, a job DAG. Courses 1–2 are mostly these, and later courses use
   one wherever the idea is the platform's and has no local run.
2. **IDE frame** — the default from Course 3 on, and ONE fixed template (`apache-spark`'s
   `ideFrame()`: explorer 300 | editor 80 columns × 18 rows over a 14-line terminal | side pane 520,
   1632 × 856), so every panel sits at the same place in every section. One file per frame; a longer
   file is folded with `show`, a longer run with `fold(session, head, tail)`. A documented file is
   shown in the same template with its terminal stating that it is not run here.
3. **IDE + model frame** — the same template, with the side pane holding what the terminal cannot
   show: versions in a log, a permission matrix, a state store, files opened per layout.

## How a section teaches

- **One step per section**: objective → mental model → annotated code and its real result →
  failure or alternative contrast → bridge. Explain a term before relying on it.
- **Code is executed, not pasted.** Run-tier code lives in `spine/<course>/<step>/` as snapshots of
  `retail-lakehouse/`, and scenes import it with `?raw`; `check:spine` fails on any difference.
- **Failure is taught, not hidden.** A write conflict, a schema refusal, a double-counted replay, a
  stream refusing an UPDATE — run first, then fixed.
- **Ordering**: governance before data access; transaction semantics before CDC; direct
  transformations before declarative automation; operational thinking recurs before its course.
- **Narration explains; the frame shows.** It never reads code aloud line by line. Nothing claims
  verified individual mastery, and finishing a course is not equated with competence.

## The courses — 13 courses, 97 sections

Tier per section: **R** run, **D** documented, **M** model, **I** illustrative, **C** concept.

### Part 0 — The picture

**1. `why-databricks` · Why a platform · 5 sections**
1. What a data product owes its consumers — freshness, correctness and cost, for three consumers (C)
2. Spark, Delta and Databricks — an engine, a table format and a platform, and what each adds (C)
3. The lakehouse — one copy of the data in open files, read by every kind of workload (C)
4. Bronze, silver and gold — a design pattern, not a guarantee (C)
5. What we will build — the `retail-lakehouse` project, and the course as its map (C)

**2. `how-databricks-runs` · How the platform runs your code · 6 sections**
1. Control plane, compute plane and your storage — what Databricks runs, and what stays in your account (C)
2. Accounts, workspaces and metastores — the boundaries above a single query (C, D)
3. Compute choices — classic clusters, serverless and SQL warehouses, and who pays while idle (C, D)
4. The Databricks Runtime — Spark and Delta inside it, and what this course runs locally instead (C)
5. A query's path — a three-part name through Unity Catalog, a credential and the files (C, D)
6. Where code is written — notebooks, files, Git folders and Databricks Connect (C, D)

### Part I — Build it

**3. `start` · Start the project · 6 sections**
1. The finished project, toured — the bundle layout, every folder and what it is for (R)
2. A new project — a virtual environment, PySpark, delta-spark and the Java they run on (R)
3. A session that speaks Delta — `src/retail/session.py`, and quiet logs (R)
4. The first table — eight raw orders written as Delta, and the `_delta_log` beside the files (R)
5. The first query — the same question in SQL and in PySpark, and one result (R)
6. Notebook source — a `.py` file a workspace opens as a notebook, run here as a script (R, D)

**4. `govern` · Govern it · 7 sections**
1. Catalogs, schemas and three-part names — `retail.silver.orders`, and the two-part name run locally (D)
2. Tables, views and volumes — tabular access against file access (D)
3. Managed and external — who owns the files, and what `DROP` does to them (D)
4. Principals, privileges and least privilege — `governance/grants.sql` and the matrix it produces (D, M)
5. Storage credentials and external locations — the cloud permission under the catalog (D)
6. Discovery, lineage and audit — the evidence a governed table leaves (D, I)
7. Sharing and federation — copying, querying in place, and who pays (D)

**5. `tables` · Make the table reliable · 8 sections**
1. Files, the log and snapshots — what a version is, read off `_delta_log` (R)
2. ACID and concurrent writes — two writers, one conflict, and the scope of the guarantee (R)
3. Schema enforcement and evolution — a contract the table keeps (R)
4. INSERT, UPDATE, DELETE and MERGE — explicit match rules, before and after (R)
5. History, time travel and restore — three different things (R)
6. Retention and VACUUM — why an old version stops being readable (R)
7. The change data feed — configured row-level changes, and their retention (R)
8. Table features and protocols — reader/writer versions, and platform against open format (R, D)

**6. `ingest` · Bring the data in · 9 sections**
1. Source contracts — format, keys, arrival pattern, and how long the source keeps it (C)
2. Batch loads and COPY INTO — idempotent by file, and what a plain repeat load does (D, R: 8 → 16)
3. Auto Loader — the `cloudFiles` source and what it adds (D)
4. File discovery and checkpoints — progress across restarts, on Spark's file source (R: 3, 6, 6, 8; 16)
5. Schema inference and drift — `"12,50"` read as 1250.00 with no flag (R, D)
6. Malformed records, rescued data and quarantine — 8 = 7 + 1 (R, D)
7. Managed connectors — what Lakeflow Connect takes on, and what stays yours (D)
8. Message buses — offsets, retention and the Kafka source (D)
9. Backfills, replay and the bronze table — duplicates arrive, and bronze keeps them (R)

**7. `transform` · Build silver and gold · 8 sections**
1. The Spark you need here — lazy plans, actions and shuffles, briefly (R; → `apache-spark`)
2. SQL and DataFrames — one intent, one plan (R)
3. Types, NULL and time — `try_cast`, nested records, and silent shifts (R)
4. Joins and cardinality — a duplicated store row turns 170.00 into 185.00 (R)
5. Windows and deterministic deduplication — the latest event per order, with a tie-breaker (R)
6. Quality rules and quarantine — 11 = 6 + 1 + 1 + 3 (R)
7. Gold as a contract — grain, measures, comments and CHECK constraints (R)
8. The silver and gold flow — order detail, customer attributes, and a summary that reconciles (R)

### Part II — Keep it correct

**8. `changes` · Handle change · 10 sections**
1. Recompute or increment — rows read, 27 against 10, and the append-only assumption (R)
2. Event time and watermarks — late data across four batches (R)
3. Stateful aggregation and deduplication — state growth with and without a watermark (R)
4. Streaming joins — orders to payments, and bounded state (R)
5. Checkpoints and restarts — what the folder holds, and which changes it survives (R)
6. Sinks, `foreachBatch` and idempotency — append against MERGE under a replayed batch (R)
7. Source CDC — keys, operations, sequence ordering and deletes (R)
8. SCD type 1 and type 2 — `src/retail/cdc.py`, and what history means (R)
9. Table CDF and source CDC — two feeds, two different questions (R)
10. A worked recovery — duplicates, out-of-order changes and history that is gone (R)

**9. `pipelines` · Declare the pipeline · 8 sections**
1. Imperative and declarative — the same flow as an application and as definitions (D)
2. Streaming tables, materialized views and views — different responsibilities (D)
3. Dependencies, flows and sinks — the graph the definitions produce (D)
4. Expectations — warn, drop and fail: 11 kept against 8 (D, M)
5. Incremental semantics — a Delta stream refusing a source UPDATE (R, D)
6. AUTO CDC and SCD — keys and sequencing, declared (D, I)
7. Updates and refreshes — refresh scope, full refresh, and what it replays (D)
8. Event logs and a walkthrough — reading a failed update (D, I)

**10. `schedule` · Schedule it · 7 sections**
1. Jobs and task DAGs — `resources/retail_daily.yml`: notebook, pipeline, SQL and wheel tasks (D)
2. Parameters and task values — what flows from the job into a task, and between tasks (D, M)
3. Schedules and triggers — freshness against runs per day and their cost (D)
4. Conditions and failure paths — run-if, a failed transform, and the alert that still runs (D, M)
5. Retries, repair and idempotency — bronze 8 or 16, with real Delta effects (M)
6. Run-as identities — whose permissions a run uses, and a refusal (D)
7. The orchestrated flow — ingest, transform, validate, publish (D, M)

### Part III — Run it

**11. `fast` · Make it fast and cheap · 8 sections**
1. A correct baseline — one million rows, one checksum, and the limits of a local measurement (R)
2. Reading execution evidence — the Spark UI, query profiles, and task quantiles from the REST API (R, D)
3. Compute sizing, serverless and Photon — eligibility, not recipes (D)
4. Joins, skew and shuffles — broadcast against sort-merge, and one hot store (R)
5. Small files and compaction — 128 files to 25 (R)
6. Partitioning, liquid clustering and skipping — files opened per layout and per filter (R)
7. Predictive optimization — what it maintains, and where it is eligible (D)
8. A worked comparison — freshness, files read and a hypothetical cost table (R, I)

**12. `operate` · Ship and operate it · 10 sections**
1. Modular code — the package beside the notebooks, and the local/remote boundary (R)
2. Wheels and environments — what the wheel carries and what the runtime provides (R)
3. Tests — unit, integration and data-quality, and a real expected-against-actual diff (R)
4. Declarative Automation Bundles — `databricks.yml` and deployment intent (D)
5. Targets, CI and promotion — development, staging, production, and a rollback (D)
6. Observability — logs, metrics, lineage and system tables (D, I)
7. Incidents and objectives — freshness lag and a quality objective, measured (R, I)
8. Recovery and deletion — backfills, checkpoints, and where deleted data still lives (R)
9. Secrets and identities — three identities and least privilege (D, I)
10. Ownership and cost attribution — who answers the incident, and who pays (D, I)

**13. `defend` · Defend the design · 5 sections**
1. End to end — source contracts through governed consumption, and which component guarantees what (R, D)
2. Changed requirements — a historical correction (173.00) and a new source (215.00) (R)
3. Jobs, pipelines or managed ingestion — what each leaves to you (D)
4. Failure and recovery critique — missing data, duplicates, drift and lost access (R, M)
5. The decision record — alternatives, guarantees, cost assumptions and unresolved risks (C)

The last words of the final narration are the course's bridge: continue with unfamiliar sources and
operating scenarios, and build practical competence through implementation experience and feedback.

## Old chapter → new course

| Previous chapter | Now |
| --- | --- |
| 1 Platform Foundations (6) | 1.1 → `why-databricks` 1; 1.2 → `why-databricks` 2–3; 1.3 → `how-databricks-runs` 1–2; 1.4 → `how-databricks-runs` 3; 1.5 → `start` 4–6; 1.6 → `why-databricks` 4 |
| 2 Governed Data and Unity Catalog (7) | `govern` 1–7 |
| 3 Delta Tables (8) | `tables` 1–8 |
| 4 Ingestion (9) | `ingest` 1–9 |
| 5 Transformations (8) | `transform` 1–8 |
| 6 Streaming, CDC (10) | `changes` 1–10 |
| 7 Declarative Pipelines (8) | `pipelines` 1–8 |
| 8 Orchestration (7) | `schedule` 1–7 |
| 9 Performance (8) | `fast` 1–8 |
| 10 Development, Deployment, Operations (10) | `operate` 1–10; 10.1's notebook/Git half → `how-databricks-runs` 6 |
| 11 Integrated Decisions (5) | `defend` 1–5 |

New in this plan: `why-databricks` 5, `how-databricks-runs` 4–5, `start` 1–3 — the platform picture
and the project's setup, which the slide course left implicit.

## Decisions (resolved)

1. **Reset.** Every course, scene, slide and wav of the slide-based course is deleted, as in
   `apache-spark`; the old scripts in `scripts/verify/` and `examples/retail_etl/` are the source the
   spine steps are rebuilt from, and are retired once their numbers are replayed by `check:spine`.
2. **Engine.** `@graphlearning/flow` ^2.2.0 and `@graphlearning/shell` ^0.13.1; scene-only sections;
   the `apache-spark` IDE template and `check-render.mjs`.
3. **Stack.** PySpark **4.0.1** + Delta Lake **4.0.0**, Python 3.13, OpenJDK 21 — identical to
   `apache-spark`, so a learner moving between the two sees the same versions. Apache Spark 4.1's
   open-source declarative pipelines were considered for Course 9 and not adopted: it would break
   that parity, and expectations and AUTO CDC are platform features anyway.
4. **Names.** Two-part names in run code, three-part in documented code, explained once.
5. **Platform claims.** Documented, not run, unless a workspace becomes available; labelled on
   screen, and re-verified against the live docs before publishing.
6. **Reference surface.** Databricks on AWS documentation (researched 2026-10-11 and 2026-10-12);
   cloud-specific storage and identity examples are labelled as AWS. Current product names:
   Lakeflow Declarative Pipelines (`from pyspark import pipelines as dp`; older DLT names for
   recognition only), Lakeflow Jobs, Lakeflow Connect, Declarative Automation Bundles (older:
   Databricks Asset Bundles).

## Sources

Primary: the official [data-engineering overview](https://docs.databricks.com/aws/en/data-engineering),
[Unity Catalog](https://docs.databricks.com/aws/en/data-governance/unity-catalog/),
[Delta Lake](https://docs.databricks.com/aws/en/delta/),
[Auto Loader](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/),
[Lakeflow pipeline concepts](https://docs.databricks.com/aws/en/ldp/concepts),
[Lakeflow Jobs](https://docs.databricks.com/aws/en/jobs/) and
[Declarative Automation Bundles](https://docs.databricks.com/aws/en/dev-tools/bundles/), plus the
[Delta Lake](https://docs.delta.io/) and [Apache Spark 4.0.1](https://spark.apache.org/docs/4.0.1/)
documentation for everything run locally. Publisher contents of
[Delta Lake: The Definitive Guide](https://www.oreilly.com/library/view/delta-lake-the/9781098151935/)
(2024) and [Learning Spark, 2nd ed.](https://www.oreilly.com/library/view/learning-spark-2nd/9781492050032/)
(2020) were compared; full text was not accessed. The Associate and Professional guides were
secondary coverage checks only.
