# CLAUDE.md — databricks-data-engineer-ct

> The workspace-level `CLAUDE.md` (one level up, in `graphl-workspace`) holds the invariants that
> span every repo. This file is only what is true *here*.

## What this repo is

A GraphL concept app for **Databricks Data Engineering — From Platform Foundations to Advanced
Application**: one concept, 11 courses (one per chapter), 86 sections. A **section** is
`(scene, slide, narration)` and is one segment of the course video. One section = one slide.

`docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md` is the source of truth for scope, audience, teaching
method, section titles, worked illustrations, outcomes and bridges. Author from it; do not drift from
its section lists. `scripts/check-plan.mjs` (part of `npm run check`) fails on any title drift.

The render engine is `@graphlearning/flow`; the app shell is `@graphlearning/shell`. Both are
**published packages pinned by version** (`flow@^1.2.0`, `shell@^0.10.1`). This repo's own surface is
`src/content/`, `src/scenes/`, `src/main.tsx` and `src/theme.css` — nothing else.

## Route contract

- Slug **`databricks-data-engineer-ct`** — the vite `base`, the path under `graphl.in`, and the GitHub
  repo name. All three must be the same string. (If the repo is renamed, change all three.)
- `#/` is the catalog. A section is `#/<courseId>-<sectionId>`, e.g. `#/foundations-first-query`.
- Audio: `public/audio/<courseId>/<sectionId>.wav`. Section ids are unique within a course; scene ids
  are unique across the whole repo.
- Brand `--brand: #FF3621` (Databricks red-orange); `--accent-2: #5eead4` (slide `###` subheadings).

## Course arc and status

Chapters are authored one at a time. The owner asked (2026-10-12) for authoring to continue chapter by
chapter without waiting, so review of rendered routes is **batched** and pending for every authored chapter. A course is registered in `src/content/index.ts` / `src/scenes/index.ts` only once authored.

| # | Course id | Chapter | Sections | Status |
| --- | --- | --- | --- | --- |
| 1 | `foundations` | Platform Foundations and a First Data Flow | 6 | authored, awaiting owner review (no narration audio yet) |
| 2 | `governance` | Governed Data and Unity Catalog | 7 | authored (all documented, not run), awaiting owner review |
| 3 | `delta-tables` | Delta Tables and Reliable Data Changes | 8 | authored (local run, `scripts/verify/ch03_delta_tables.py`), awaiting owner review |
| 4 | `ingestion` | Ingestion and Incremental Arrival | 9 | authored (Spark file stream locally; Auto Loader etc. documented, not run), awaiting owner review |
| 5 | `transformations` | Transformations and Business Data Products | 8 | authored (local run, `scripts/verify/ch05_transformations.py`), awaiting owner review |
| 6 | `streaming-cdc` | Streaming, CDC, and Changing State | 10 | authored (local run, `scripts/verify/ch06_streaming_cdc.py`; CONFIGURED change feed only), awaiting owner review |
| 7 | `pipelines` | Declarative Data Pipelines | 8 | not started |
| 8 | `orchestration` | Orchestration and Workload Dependencies | 7 | not started |
| 9 | `performance` | Performance, Layout, and Cost | 8 | not started |
| 10 | `operations` | Development, Deployment, and Operations | 10 | not started |
| 11 | `integration` | Integrated Engineering Decisions | 5 | not started |

Source layout per course: `src/content/<course>/NN-<section-id>.ts` plus `index.ts` (`NN` = the plan's
section number; `title` = the plan's section title **verbatim**); `src/scenes/<course>/` plus
`index.ts` exporting `<course>Scenes`; `public/audio/<course>/`. The chapter's objective, outcome,
worked illustrations and bridge go in a comment in the course's `index.ts`; the **bridge is also the
last words of the chapter's final narration**.

## Verification notes (read before trusting a number or a claim)

There is **no Databricks workspace** in the authoring environment, and `docs.databricks.com` was not
reachable from it (the proxy returns 403). So claims fall in three tiers — say which tier a slide is in:

1. **Run locally.** Spark SQL / PySpark and Delta behaviour that does not need the platform: Delta DML,
   MERGE, schema enforcement, history / time travel / restore, VACUUM, change data feed, windows,
   joins, streaming watermarks. These are run on **PySpark 4.0.1 + Delta Lake 4.0.0, `local[2]`** — not
   on a Databricks Runtime — and every output on a slide is what that run printed. File counts and
   task counts depend on partitioning and may differ on Databricks. Chapter-by-chapter scripts live in
   `scripts/verify/` and assert what the slides quote (`scripts/verify/ch01_foundations.py`).
2. **Documented, not executed.** Unity Catalog grants, Auto Loader, `AUTO CDC`, expectations, jobs, bundles,
   Photon, serverless. Checked against the Databricks on AWS docs where reachable; label them
   "documented, not run", and record the runtime / compute / feature requirement each one needs. Do not
   assume cloud parity or feature availability. No preview feature in baseline examples.
3. **Illustrative.** Event logs, Spark UI / profile excerpts, requirements, cost examples. Label them
   as illustrative; never quote prices.

Nothing here claims verified individual mastery, and nothing equates finishing a chapter with competence.

## The recurring example — frozen, slides quote its numbers

Retail orders. **Chapter 1 sample** (`bronze_orders`, 8 raw rows, all columns text):
`o1 7 40.00 COMPLETED · o2 7 25.00 COMPLETED · o3 9 60.00 CANCELLED · o4 9 15.00 COMPLETED ·
o5 12 80.00 COMPLETED · o6 7 10.00 PENDING · o4 resent (identical) · o7 9 "n/a" COMPLETED`.
Silver (`silver_orders`) = 6 typed unique rows (o4 merged, o7 rejected); gold (`gold_sales`) = completed
sales per store, `7 → 2 orders 65.00 · 9 → 1 15.00 · 12 → 1 80.00`, total **160.00**; reconciliation
**8 = 6 + 1 resend + 1 rejected**; first query returns CANCELLED 1 / COMPLETED 6 / PENDING 1, but only
**4** distinct valid completed orders. Same six-order core as `apache-spark-ct`. Extend it in later
chapters (customer updates, reference data); do not change these numbers.

## Chapter 3 frozen facts (local run; slides quote them)

Table `orders` (the silver table; typed): v0 CREATE, v1 six rows (o1..o6; o3 CANCELLED, o6 PENDING),
v2 INSERT o8 (12, 20.00, PENDING), v3 UPDATE o6 → COMPLETED, v4 DELETE o3, v5 MERGE (o8 → COMPLETED,
o9 (9, 45.00) inserted), v6 RESTORE to v4. Row counts per version `0, 6, 7, 7, 6, 7`; restore leaves 6.
Side tables: `orders_c` (contract), `orders_race` (conflict: o1 ends 41.00 COMPLETED), `ret` (VACUUM),
`feed` (change feed), `late`. File counts depend on partitioning — never quote them. NOT NULL had to
be declared at CREATE (the local Delta refused `ALTER ... SET NOT NULL`).

## Chapter 4 frozen facts (local run; slides quote them)

Three landing CSVs (header `order_id,store_id,amount,status`): a = o1, o2, o3; b = o4, o5, o6; c = o4
(resent), o7 (amount `n/a`). Arrival timeline with one checkpoint: **3, 6, 6, 8**; a deleted checkpoint
re-reads everything (**16**). 8 rows, **7** distinct `order_id`. Drift demo: JSON `1.json` (normal) and
`2.json` (amount `"12,50"`, new field `channel`); a fixed schema drops `channel` and parses `"12,50"` as
**1250.00** with no flag. Local analogue only: Spark's file stream source, not Auto Loader.

## Chapter 5 frozen facts (local run; slides quote them)

`bronze_events`, 11 text rows (columns `order_id, store_id, amount, status, event_ts, source_file`): the three
landing files of Chapter 4 plus file d (`o6` COMPLETED 09:41, `o8` amount -5.00, `o9` unknown store 15).
Reference `stores` = 7 Leeds, 9 York, 12 Hull (`stores_dup` repeats York). Quality rules: amount readable
(fails o7), amount positive (o8), store known (o9). **11 = 6 silver + 1 identical resend + 1 superseded o6 +
3 quarantined.** `silver_orders` (6): o1 7 40.00 · o2 7 25.00 · o3 9 60.00 CANCELLED · o4 9 15.00 · o5 12 80.00
· o6 7 10.00 (all COMPLETED unless noted). `gold_sales`: Leeds 3 / 75.00, York 1 / 15.00, Hull 1 / 80.00 —
total **170.00** (Chapter 1's 160.00 had o6 still PENDING). Join inflation: 5 rows / 170.00 vs 6 rows / 185.00.

## Chapter 6 frozen facts (local run; slides quote them)

Streaming input: four JSON files, ten order events, **one file per batch**, file mtimes set explicitly (Spark
reads oldest-first; equal times make the order arbitrary — the first attempt got batches in the wrong order).
f1 o1 09:01 40, o2 09:04 25, o4 09:14 15 · f2 o5 09:17 80, o6 09:23 10, o4 resent · f3 o10 09:06 30 (late),
o11 09:31 20 · f4 o12 09:02 5 (very late), o13 09:44 50. 10-minute windows, 10-minute watermark: batch
watermarks none / 09:04 / 09:13 / 09:21 / 09:34; windows written 09:00 = 95.00, 09:10 = 110.00 (the resend is
counted twice: no dedupe), 09:20 = 10.00; o12 dropped, o10 counted. Payments p1–p4 for the join demo.
CDC feed: 8 records in 3 arrival batches over o1/o2/o3 (see `cdc-feed`). The change feed is **configured**
(`delta.enableChangeDataFeed = true`); automatic feeds on eligible tables are NOT tested — never claim them.

## Authoring conventions

- Teaching method per section: objective → mental model → annotated code / configuration and expected
  results → failure or alternative contrast → explanation summary → bridge. Explain a term before
  relying on it; governance begins before data access; transaction semantics precede CDC; direct
  transformations precede declarative automation.
- **Slides** carry the objective/model, the worked numbers or example, and the misconception as visible
  blocks — never a transcript of the narration. Target **850–1000** modelled px (`npm run check`
  fails above 1000; the rendered 80–95 % band is the real target). Every fact on a slide gets its
  sentence in the narration.
- Use **current API names**; label older DLT terminology only for recognition. Scope per the plan:
  no ML/AI, no comprehensive BI authoring, no cloud account/network administration, no certification
  prep, no exam weights or practice questions.
- Reference the SQL, Python and Spark courses (`sql`, `python-ct`, `apache-spark-ct`) for foundations
  rather than repeating them.
- Long identifiers do not wrap in leaf cards (`gold_store_sales` was 16 > 14): shorten the name or put
  it in a code card.

## Scene inventory

Each course adds its rows here as it is authored.

| Scene id | Shape | Used by |
| --- | --- | --- |
| `requirements-matrix` | consumers table (freshness / correctness / cost lever) → design-questions `list` | `foundations-data-engineering-requirements` |
| `lakehouse-stack` | 2×2 who-does-what group → on-disk container: directory + `_delta_log` code card, DESCRIBE table | `foundations-lakehouse-concepts` |
| `platform-boundaries` | account (two workspaces) → compute (serverless / classic) → object storage | `foundations-accounts-workspaces-boundaries` |
| `compute-choice` | compute-families table → provisional-choices `list` | `foundations-compute-choices` |
| `first-query` | SQL and PySpark cards stacked → result table beside an execution-steps `list` | `foundations-first-query` |
| `layered-products` | bronze → silver → gold chain beside silver SQL card, reconciliation table, caveat `list` | `foundations-layered-data-products` |
| `uc-hierarchy` | metastore → catalog → three schemas tree above a qualified-names code card | `governance-metastores-catalogs-schemas` |
| `tables-vs-volumes` | securables table above two access code cards (SQL name, /Volumes path) | `governance-tables-views-volumes` |
| `managed-vs-external` | ownership table above the two CREATE statements | `governance-managed-vs-external` |
| `least-privilege` | GRANT excerpt → who-can-do-what matrix → denied-access trace | `governance-principals-and-privileges` |
| `storage-boundaries` | three-controls table → IAM role → credential → location chain → CREATE EXTERNAL LOCATION | `governance-storage-credentials-and-locations` |
| `lineage-audit` | four-object lineage chain beside lineage query, evidence list and illustrative result | `governance-discovery-lineage-audit` |
| `share-vs-federate` | ingest / sharing / federation table → choose-by `list` | `governance-sharing-vs-federation` |
| `delta-versions` | version/operation/rows table above `_delta_log` actions per commit | `delta-tables-files-logs-snapshots` |
| `write-conflict` | writer A/B timeline table → trimmed exception card → guarantee-scope `list` | `delta-tables-acid-concurrent-writes` |
| `schema-contract` | CREATE + CHECK code card above five-writes outcome table | `delta-tables-schema-enforcement-evolution` |
| `dml-semantics` | MERGE code + source + before/after (left) beside measured-effect table + match rules (right) | `delta-tables-dml-and-merge` |
| `history-restore` | history/restore code → history table → read-vs-write command table | `delta-tables-history-time-travel-restore` |
| `retention-timeline` | readability table before/after VACUUM → VACUUM code → defaults `list` | `delta-tables-retention-and-vacuum` |
| `change-feed` | readChangeFeed code → five change rows → not-an-archive `list` | `delta-tables-change-data-feed` |
| `table-features` | protocol-by-table table → compatibility questions `list` | `delta-tables-table-features-compatibility` |
| `source-contract` | source-contract table → ask-before-ingesting `list` | `ingestion-source-contracts` |
| `batch-load` | COPY INTO card → repeat-load table (8, 16) → assumptions `list` | `ingestion-batch-loads-copy-into` |
| `auto-loader` | cloudFiles PySpark card above what-it-adds `list` | `ingestion-auto-loader-cloudfiles` |
| `file-progress` | five-run arrival timeline above the checkpoint directory card | `ingestion-file-discovery-checkpoints` |
| `schema-drift` | drift-reads table → the odd JSON file → Auto Loader modes `list` | `ingestion-schema-inference-evolution` |
| `rescued-quarantine` | PERMISSIVE parse code → flagged-row table → 8 = 7 + 1 reconciliation | `ingestion-rescued-data-quarantine` |
| `connector-matrix` | your-code vs connector responsibility table → before-choosing `list` | `ingestion-managed-connectors-lakeflow-connect` |
| `message-bus` | resume-position table → Kafka read card → assumptions `list` | `ingestion-message-bus-streaming-sources` |
| `bronze-walkthrough` | source-to-bronze counts table above the bronze design card | `ingestion-backfills-replay-bronze-walkthrough` |
| `spark-plan-model` | lazy-code card → trimmed explain() card → status-counts table | `transformations-spark-model-for-transformations` |
| `sql-df-equivalence` | SQL and PySpark cards (left) beside result table and plan note (right) | `transformations-sql-and-dataframe-equivalence` |
| `types-nulls-time` | try_cast / NULL table above the silent-shifts table | `transformations-parsing-types-null-time` |
| `join-cardinality` | clean vs duplicated reference table → stores_dup → key-guard query | `transformations-joins-keys-cardinality` |
| `window-dedupe` | row_number code → ranked rows → tie-breaker `list` | `transformations-windows-ranking-dedupe` |
| `quality-quarantine` | rules table above the 11 = 6 + 1 + 1 + 3 reconciliation | `transformations-quality-rules-quarantine` |
| `gold-contract` | gold DDL with comments and CHECK above the three-store result | `transformations-dimensional-outputs-contracts` |
| `silver-gold-flow` | bronze → silver → gold chain above silver build code and detail = summary table | `transformations-worked-silver-gold-flow` |
| `recompute-vs-incremental` | rows-read table (27 vs 10) → incremental-assumptions `list` | `streaming-cdc-recompute-vs-incremental` |
| `watermark-timeline` | batch / watermark / emitted-window table → two late events `list` | `streaming-cdc-event-time-watermarks` |
| `state-growth` | state rows per batch (sum/dedup, with/without watermark) → dedup code → bounded `list` | `streaming-cdc-stateful-aggregation-dedup` |
| `stream-joins` | join-condition card → inner-join output per batch | `streaming-cdc-streaming-joins` |
| `restart-changes` | restart/change results table → refusal card → checkpoint-holds `list` | `streaming-cdc-checkpoints-restarts-changes` |
| `replay-sinks` | append vs MERGE sink counts → idempotent writer card → at-least-once `list` | `streaming-cdc-sinks-foreachbatch-idempotency` |
| `cdc-feed` | eight-record feed table above arrival-order vs by-sequence result tables | `streaming-cdc-source-cdc-sequence-deletes` |
| `scd-types` | SCD1 table above SCD2 history table | `streaming-cdc-scd-type-1-vs-2` |
| `cdf-vs-cdc` | source records vs table feed rows table → different-questions `list` | `streaming-cdc-cdf-vs-source-cdc` |
| `recovery-guards` | sequence-guarded MERGE card → tested problem/guard/result table | `streaming-cdc-worked-recovery` |

Layout lessons from Chapter 1 (the rendered frame is the only judge): a scene is fitted to a roughly
square pane, so a board that is wide and short ends up **sparse** (0.36 of the pane height) — stack
code cards with `cols: 1` and use `flow: 'TB'`, then put two peers side by side with `cols: 2` to balance
width against height. Putting a code card and a table in one `cols: 1` container beside a tall chain
sets the board's scale; check both axes. Leaf-card text is capped (label tokens ≤ 14 characters).

## Invariants — do not break

- **Never write `x` or `y`.** Scenes are declarative: nodes, edges, nesting. `computeLayout` is not
  exported, so there is no way around this, and that is the point — reproducible frames.
- **Do not reimplement the shell.** `SectionView`, `CourseIndex`, `SlidePanel` and the hooks are
  withheld on purpose. The route contract (`#/<courseId>-<sectionId>`, `?capture=1`,
  `window.__scene.plan()`) is what every recorder drives, and it holds only if every repo composes
  the pieces identically.
- **`SiteHeader` goes on the catalog page only** — never on a section. A section is a video frame.
- **Three stylesheets, in cascade order**, imported in `main.tsx`. The order is load-bearing:
  1. `@graphlearning/flow/styles.css` — react-flow plus the IBM Plex faces the engine is
     *calibrated* to. `codeMetrics` sizes code nodes from a measured 9.02px glyph advance, so a
     different monospace face mis-sizes every code card. Carries the `.tok-*` colours.
  2. `@graphlearning/shell/styles.css` — the shell paints the canvas (`--bg: #1a1d23`; SceneView
     draws its dots at `#2a2f38` assuming a dark surface).
  3. `./theme.css` — this repo's three brand tokens. **Last, or the brand loses to the defaults.**
- **`file:../ui-flow` / `file:../ui-shell` must never be committed.** Local engine work only; CI has
  no sibling checkout.
- **Narration is never hand-produced.** `.tts` → `.wav` via Colab + Chatterbox only.

## Layout rules the frames actually care about

`npm run check` (`scripts/check-content.mjs`) models four silent failures — each builds green and
breaks only on screen. Its comments carry the measured constants; the short version:

- **Leaf cards are a fixed 210×96** with a ~134px text column. Only containers grow to fit. Keep the
  `label` to 2 wrapped lines; 2 label lines + 2 sub lines fits. Watch unbreakable tokens — `_`, `.`
  and `/` are **not** break opportunities in CSS, so `snake_case` and paths overflow sideways in a
  way the height model cannot see.
- **Slides do not scale to fit.** Type size is fixed by the frame (`zoom = paneWidth / 806`,
  width-proportional only), so an over-long slide **clips at the bottom** with no error.
  `check` fails over 1000 modelled design px; the band below gives the floor too. Bullets cost far
  more than prose of the same length.
- **A `focus:` that names no node in its scene is a silent no-op** — nothing lights up.
- **`icon:` names are NOT guarded.** The engine's lucide registry is `Record<string, LucideIcon>`
  and does not enumerate its keys, so a wrong name type-checks, passes `check`, builds, and renders
  a card with no glyph. There are ~75 valid keys; copy one off an existing scene rather than
  guessing a lucide name (`volume`, `move`, `maximize` and `git` are all absent, for instance).
- **A section with no wav narrates silence** and records a silent segment. Audio resolves purely by
  convention: `public/audio/<course>/<section-id>.wav`.

What `check` does *not* model: an edge label landing on top of a card, or whether the frame is too
empty. Look at the route.

### Density targets — the frame must use the space it has

The guarded failure is a slide that overflows. The unguarded one is its opposite: a frame that
builds green, reads correctly, and leaves half its pane empty. Against the ~1080 design px pane:

| | target | why |
| --- | --- | --- |
| slide height | **80–95 %** of the pane (≈ 865–1025px; `SLIDE_H_MAX` caps the top at 1000) | below 80 % the right half looks empty; above ~95 % it risks clipping |
| scene, binding axis | ≥ 0.85 of the pane | the board should reach the edge it is limited by |
| scene, area | ≥ 0.55 of the pane (w × h) | a wide board that fills the width but a third of the height wastes the pane |
| eyebrow | no node under the top-left eyebrow label | boards that bind on height run up to y≈30 |

Levers: **add real content, not padding**; **restack** a board toward the pane's ~1:1 aspect; lower
scene `padding` to 0.04 for boards that float, **raise** it (0.12–0.17) for tall boards that touch
the eyebrow.

These are read off the rendered route by eye — `check` models no density at all. The two ratios come
from one repo's ~80 frames of diagram-and-code-card boards, so a deliberately sparse board can sit
under them. Targets, not thresholds.

## Guards before handing over

```sh
npm run build && npx tsc --noEmit && npm run check
```

All three are a **floor, not proof** — they pass on frames that are visually wrong. The rendered
route is the real bar, and the owner reviews it.

## Working agreement

- **Author the whole unit, then hand over the route.** Scenes, slides and narration together.
- **No ASCII sketches of scenes.** A sketch cannot show what the layout engine will do, which is the
  only thing worth looking at.
- **No silent scaffolding**, no work outside the ask. Say plainly what was built, what was verified,
  and what was left out.
