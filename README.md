# databricks-data-engineer-ct

Video-first content for the **Databricks Certified Data Engineer Associate** concept, consumed at runtime by the [`graphl-movie`](../graphl-movie) app. Content only — notebooks, narration (`.tts` → `.wav`), authored one-screen slides (`.slide`: a `# Title`, `## ` sub-labels, short prose, fenced code, and `- `/numbered lists with **bold** key terms), and the wiring `manifest.json`. Nothing to build or run here. For the authoring contract and folder layout, see [`CLAUDE.md`](./CLAUDE.md).

This file is the **course outline** — the human-facing map of modules and sections. It is the plan we author against; the machine source of truth for structure is `manifest.json`.

**Status:** repo pushed public (`github.com/schemabotview/databricks-data-engineer-ct`). **Modules 01–03 are complete end-to-end** — every section has `.ipynb` + `.tts` + `.wav` + `.slide`, and `manifest.json` wires them (scene/highlight/focus/audio) so graphl-movie records them to 1080p video. **Modules 04–09 are authored** — 11 + 10 + 10 + 9 + 10 + 9 sections with `.ipynb` (split from the reference per-module notebooks) + `.tts` + `.slide`, manifest wired; their `.wav`s are pending Colab. **All 9 modules / 90 sections are now authored and wired — the full course spine is complete**; the only remaining work is generating `audio/*.wav` for modules 04–09.

## Target exam

**Databricks Certified Data Engineer Associate** — version dated May 4, 2026 (45 multiple-choice questions, 90 minutes). Seven weighted sections in the official outline; the module spine below mirrors them.

## Module spine (agreed)

Nine thematic modules, each authored as one standalone narrated video (one dense scene + a linear section walkthrough). The practice-exam module from the source curriculum is intentionally **not** part of the video set (Q&A is a weak fit for the narrated-scene format).

| # | Module | Exam section | Weight |
|---|---|---|---|
| 01 | Data Intelligence Platform & Compute | 1. Databricks Data Intelligence Platform | 6% |
| 02 | Delta Lake & Unity Catalog Foundations | 1. Databricks Data Intelligence Platform | 6% |
| 03 | Data Ingestion: COPY INTO, Auto Loader, Lakeflow Connect | 2. Data Ingestion and Loading | 21% |
| 04 | Data Transformations with PySpark & Spark SQL | 3. Data Transformation and Modeling | 22% |
| 05 | Modeling: Medallion, MVs, Streaming Tables, Declarative Pipelines | 3. Data Transformation and Modeling | 22% |
| 06 | Lakeflow Jobs: Orchestration, Triggers, Control Flow | 4. Working with Lakeflow Jobs | 16% |
| 07 | CI/CD: Git Folders, Automation Bundles, Databricks CLI | 5. Implementing CI/CD | 10% |
| 08 | Troubleshooting, Monitoring & Optimization | 6. Troubleshooting, Monitoring, and Optimization | 10% |
| 09 | Governance & Security: ACLs, Masking, Row Filters, ABAC | 7. Governance and Security | 15% |

Sections 3 (Transformation + Modeling) spans two modules (04, 05); Section 1 carries two modules (01, 02) because Delta Lake + Unity Catalog are foundational to everything downstream, not because the section is heavily weighted.

## Sections (TBD — next pass)

Each module targets **~10–12 tight teaching sections** (a section = one narrated slide + scene focus, ≈ one page). The source modules run 14–20 sections; we'll normalize down, dropping the silent "What's covered" / self-check / "Summary" scaffolding that isn't a real teaching beat. Per-module section lists get filled in here as we agree them, module by module.

The **Fintech bank reference domain** is not a standalone section — it's woven into narration wherever a concrete example helps.

### 01 — Data Intelligence Platform & Compute (10 sections)

1. Why the lakehouse — warehouse vs. lake, and why they fused *(hook — full map)*
2. What the Data Intelligence Platform is
3. Architecture — control plane vs. compute plane
4. The platform stack at a glance *(overview; the layer detail lives in module 02)*
5. The workspace — what a data engineer touches daily
6. Clusters — all-purpose vs. job
7. SQL warehouses & serverless compute
8. Choosing compute — the four-scenario cheat sheet
9. Cost model — DBUs, autoscaling, auto-termination
10. Databricks Runtime & Photon

_Deferred into module 02 (Delta + UC foundations):_ the three-level namespace (`catalog.schema.object`) and managed vs. external tables.

### 02 — Delta Lake & Unity Catalog Foundations (10 sections)

1. Why Delta Lake — what raw Parquet on object storage doesn't give you *(hook — full map)*
2. The transaction log & ACID — how a commit buys the guarantees
3. Time travel — querying an old version of a table
4. Schema enforcement & evolution
5. Changing data — `MERGE INTO`, `UPDATE`, `DELETE` (deletion vectors)
6. Table maintenance — `OPTIMIZE`, `ZORDER`, `VACUUM`
7. Liquid Clustering — the modern replacement for partitioning + `ZORDER`
8. Unity Catalog & the three-level namespace (`catalog.schema.object`) *(absorbs the `hive_metastore` legacy as a callout)*
9. Managed vs. external tables — and converting between them
10. Volumes — governed storage for files, not rows

_Deferred out of module 02:_ Predictive Optimization → module 08 (Optimization); Delta UniForm (Iceberg interop) dropped as niche for the Associate exam.

### 03 — Data Ingestion: COPY INTO, Auto Loader, Lakeflow Connect (11 sections)

Runs to 11 (vs. the 10 baseline) to track the 21% exam weight — the heaviest section. Auto Loader gets three sections; the lighter connector/direct-pull material is compressed into one.

1. Three ingestion patterns — batch, incremental, streaming *(hook — full map)*
2. `COPY INTO` — idempotent file ingestion in pure SQL
3. Auto Loader — `cloudFiles`, the workhorse
4. Auto Loader — directory listing vs. file-notification mode
5. Auto Loader — schema inference & evolution modes
6. `COPY INTO` vs. Auto Loader — when each wins
7. Lakeflow Connect & managed connectors (SaaS + database CDC)
8. Other inbound paths — partner connectors, JDBC/ODBC, REST API
9. Semi-structured & nested data — JSON into Delta
10. Lakehouse Federation — when *not* to ingest at all
11. The decision sheet — pick the right ingestion path

### 04 — Data Transformations with PySpark & Spark SQL (11 sections)

First half of the 22% Section 3. Cleaning/shaping ops are consolidated; the heavily-tested operations (joins, aggregates, window functions, tuning) stay as their own beats.

1. Bronze → silver — what changes between layers (reading bronze) *(hook — full map)*
2. Cleaning & standardizing — nulls, types, casting
3. Column & row operations — `select`, `withColumn`, filter, dedup
4. Joins — the seven types
5. Broadcast joins & join performance
6. Unions & combining — `union` / `unionAll` / `unionByName`
7. Splitting & exploding arrays (semi-structured → rows)
8. Aggregates the exam tests
9. Window functions — the pattern silver & gold lean on
10. Performance tuning knobs — the four the exam asks about
11. Writing to silver — save modes, partitioning, idempotency

### 05 — Modeling: Medallion, MVs, Streaming Tables, Declarative Pipelines (10 sections)

Second half of the 22% Section 3. Plain views fold into the object-types overview; `CHECK` constraints fold into the expectations beat.

1. Medallion architecture — what belongs in each layer *(hook — full map)*
2. The five gold object types (incl. plain views as security barriers)
3. Materialized views — precomputed, auto-refreshed, queried like a table
4. Streaming tables — append-only, continuous, declarative
5. Declarative pipelines — defining datasets in Python & SQL
6. Expectations — declarative data quality (+ `CHECK` constraints on plain Delta)
7. `APPLY CHANGES INTO` — declarative CDC & SCD
8. Pipeline modes, settings & the development workflow
9. Modeling gold — the patterns BI and ML want
10. The decision sheet — picking the right gold object

### 06 — Lakeflow Jobs: Orchestration, Triggers, Control Flow (10 sections)

Section 4 (16%). The trigger decision folds into the triggers beat; deep bundle/YAML authoring is deferred to module 07 so it isn't taught twice.

1. What is a Lakeflow Job? *(hook — full map)*
2. The DAG — tasks & dependencies
3. Task types — the four the exam tests by name
4. Control flow — `if/else`, `for_each`, retries
5. Triggers — time-based vs. data-driven (file arrival), the exam decision
6. Compute for jobs — per-task choice
7. Parameters, task values & task references
8. Notifications & operational hooks
9. Monitoring, repair & rerun
10. Defining a job — UI, REST API & YAML

### 07 — CI/CD: Git Folders, Automation Bundles, Databricks CLI (9 sections)

Section 5 (10%). Lands at 9 (below the 10 baseline) — the source module is genuinely lean and lightly weighted; only scaffolding was dropped, no forced merges. The bundle manifest + resources stay two beats to hold the YAML depth deferred from module 06.

1. The problem CI/CD solves on Databricks *(hook — full map)*
2. Databricks Git Folders — what the exam wants you to know
3. Databricks Asset Bundles — the `databricks.yml` manifest
4. Resources — jobs, pipelines & other bundle-managed objects
5. Variables & environment overrides — one codebase, three behaviours
6. The Databricks CLI — `bundle validate / deploy / run / destroy`
7. CI workflow — promotion dev → test → prod
8. Run-as identity — service principals in non-dev
9. What belongs in a bundle, what doesn't

### 08 — Troubleshooting, Monitoring & Optimization (10 sections)

Section 6 (10%). Houses **Predictive Optimization** deferred from module 02 (folded with Liquid Clustering's operational angle into #8). The three bottlenecks stay distinct beats since the exam tests each.

1. The diagnostic flow — where to look first *(hook — full map)*
2. Lakeflow Jobs run history — trend, not snapshot
3. Spark UI — reading the tabs
4. Data skew — spotting and fixing it
5. Shuffling — the cost and how to cut it
6. Disk spilling — when a stage runs out of memory
7. AQE — what adaptive query execution fixes automatically
8. Automated maintenance — Liquid Clustering & Predictive Optimization
9. Common failures — cluster startup & library conflicts
10. Out-of-memory — executor vs. driver, and the fix patterns

### 09 — Governance & Security: ACLs, Masking, Row Filters, ABAC (9 sections)

Section 7 (15%). Managed vs. external tables (+ converting) is dropped here — already taught in module 02 — so there's no padding. Fine-grained access controls stay four distinct beats (masking, row filters, ABAC, dynamic views) to match the weight.

1. The security hierarchy — how Unity Catalog governs access *(hook — full map)*
2. Privileges — what each one buys you
3. `GRANT` / `REVOKE` / `DENY` — on principals
4. Column masking
5. Row filters
6. Unity Catalog ABAC — attribute-based access control
7. Dynamic views — the older fine-grained alternative
8. Audit log — who did what, and when
9. The decision sheet — picking the right access control

_Open (optional):_ a short course-outro (closing slide + narration) to end the series — deferred, not decided.

## Reference material

- Source curriculum: `~/Projects/databricks-data-engineer` and the graphl-ux-era `../databricks-data-engineer-content` (reference, not copied wholesale — we are refining). Each module's section notebooks are **split from that repo's per-module reference notebook** (the source of truth for the split), then trimmed to the video spine — e.g. module 02 came from its `notebooks/02-delta-lake-unity-catalog.ipynb`.
- Official exam guide PDF: `~/Downloads/databricks-certified-data-engineer-associate-exam-guide-may-2026-000.pdf`.
