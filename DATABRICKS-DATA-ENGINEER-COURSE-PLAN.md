# Databricks Data Engineering — From Platform Foundations to Advanced Application

## Audience and prerequisites

For learners new to Databricks who understand basic SQL queries and Python functions/collections. Introduce the necessary Spark execution concepts locally; use the separate SQL, Python, and Spark plans for deeper prerequisites and internals.

This is a platform-engineering course, independent of Associate or Professional certification. Official documentation guides coverage and correctness; certification outlines serve only as secondary topic checks. No exam weights, practice questions, certification promise, paid workspace, cloud account, or monitored submissions are required.

Scope: governed data access, transactional tables, ingestion, transformations, streaming/CDC, declarative pipelines, orchestration, performance, delivery, and operations. Explain application through annotated SQL/PySpark, configuration, expected results, diagrams, and failure traces. Learners may follow along; execution is optional.

Reference surface: **Databricks on AWS documentation**, researched on **2026-10-11 and 2026-10-12**. Explain portable platform concepts and label cloud-specific storage/identity examples. There is no single version governing every service: identify applicable runtime, compute, table-feature, and API requirements when detailed examples are authored. Do not assume cloud parity or feature availability. No preview feature is essential to the core progression.

Target: understand how to construct and explain a reliable Databricks data product, interpret its code and execution evidence, and justify governance, correctness, deployment, performance, and recovery choices. Individual implementation competence is not assessed.

Structure: **11 chapters**, with **6, 7, 8, 9, 8, 10, 8, 7, 8, 10, and 5 sections**. Counts reflect conceptual scope rather than quotas or equal teaching duration.

## Learning spine

Understand platform responsibilities → establish governed access → understand transactional tables → ingest source data → transform into useful products → handle ongoing changes → express managed pipelines → orchestrate work → investigate performance/cost → deploy and operate safely → explain a complete production design.

Recurring example: retail orders, customer updates, and reference data move from raw arrival to validated details and business summaries. The lecturer evolves the flow as source schemas, event order, consumer freshness, volumes, identities, and recovery requirements change. Bronze/silver/gold is used where helpful, not prescribed as a universal architecture.

Teaching method: objective → mental model → annotated code/configuration and expected results → alternative or failure contrast → explanation summary → bridge. Governance begins before data access; transaction semantics precede CDC; direct transformations precede declarative automation; operational thinking recurs before its dedicated chapter.

## Chapter 1 — Platform Foundations and a First Data Flow

Objective: Explain the platform’s responsibilities and follow a small dataset from source to query.

1. Data engineering requirements: consumers, freshness, correctness, and cost
2. Lakehouse concepts and the relationship between Spark, Delta, and Databricks
3. Accounts, workspaces, storage, and execution boundaries
4. Compute choices: serverless, classic workloads, and SQL warehouses
5. Notebooks, SQL, PySpark, and an annotated first query
6. Layered data products: bronze/silver/gold as a design pattern

Worked illustrations: A source-to-query diagram; a small order dataset and its first SQL/PySpark result; a compute-choice table. Separate storage from compute, and explain why layer names do not themselves provide transactional guarantees.

Outcome: Explain where code runs and data resides, interpret a simple flow, and justify a provisional compute and layering choice.

Bridge: The flow needs named data objects and authorised access; next we establish governance before ingestion.

## Chapter 2 — Governed Data and Unity Catalog

Objective: Explain data ownership and access across logical objects and storage boundaries.

1. Metastores, catalogs, schemas, and fully qualified object names
2. Tables, views, volumes, and the difference between tabular and file access
3. Managed versus external objects: ownership and lifecycle responsibilities
4. Users, groups, service principals, privileges, and least privilege
5. Storage credentials, external locations, and cloud permission boundaries
6. Discovery, metadata, lineage, and audit evidence
7. Sharing versus federation: copying, querying, access, and cost trade-offs

Worked illustrations: A catalog/schema/object tree; sample CREATE and GRANT statements; a permission matrix; table-versus-volume access examples; a denied-access trace; a lineage diagram. Explain workspace, Unity Catalog, and cloud controls separately; verify prerequisites for each concrete example.

Outcome: Interpret object names and grants, distinguish managed/external responsibilities, and explain which identity and storage boundary governs an operation.

Bridge: Governance defines who can access data; next we explain the table semantics that make changes reliable.

## Chapter 3 — Delta Tables and Reliable Data Changes

Objective: Explain transactional table behaviour and its retention and compatibility limits.

1. Data files, transaction logs, snapshots, and table metadata
2. ACID, concurrent writes, and the scope of transaction guarantees
3. Schema enforcement, evolution, and data contracts
4. INSERT, UPDATE, DELETE, and MERGE with explicit match semantics
5. History, time travel, restore, and their distinctions
6. Retention and VACUUM: recoverability, readers, and storage trade-offs
7. Change data feed concepts and availability/retention boundaries
8. Table features, reader/writer compatibility, and platform versus open-format behaviour

Worked illustrations: A table-snapshot diagram and version sequence; DML with before/after rows; conflicting writes; schema drift; history/time-travel queries; a retention timeline explaining why a former version may become unreadable. Contrast source CDC and table CDF without treating either as a permanent archive.

Outcome: Interpret table versions and changes, explain schema and concurrency decisions, and identify retention or compatibility assumptions behind recovery.

Bridge: We have a governed transactional destination; next we bring source data into it incrementally and account for imperfect inputs.

## Chapter 4 — Ingestion and Incremental Arrival

Objective: Compare ingestion methods and explain progress tracking, schema drift, and replay.

1. Source contracts: formats, keys, arrival patterns, and source retention
2. Batch loads and COPY INTO: scope and repeat-load assumptions
3. Auto Loader and the cloudFiles source
4. File discovery, progress tracking, checkpoint ownership, and identity
5. Schema inference, evolution, and unexpected type changes
6. Rescued data, quarantine, malformed records, and reconciliation
7. Managed connectors and Lakeflow Connect: responsibilities and source limits
8. Message-bus and streaming-source ingestion: offsets and operational assumptions
9. Backfills, replay, duplicate source events, and the first bronze-table walkthrough

Worked illustrations: Annotated batch SQL and Auto Loader PySpark; a file-arrival timeline; schema/rescued-record examples; source-to-bronze counts; a connector responsibility matrix. Distinguish pipeline-managed state from application-managed checkpoints, and qualify processing guarantees by source and destination.

Outcome: Compare ingestion options, trace progress after restart, and explain how schema drift, duplicate inputs, or source retention affects completeness.

Bridge: Raw arrival is accounted for; next we turn it into correct and useful business records.

## Chapter 5 — Transformations and Business Data Products

Objective: Construct understandable transformations that preserve grain and business meaning.

1. The Spark model needed here: partitions, lazy execution, actions, and shuffles
2. Equivalent SQL and DataFrame expressions and their shared query intent
3. Parsing, types, NULL, nested records, and timestamp assumptions
4. Joins, keys, cardinality, and duplicate amplification
5. Windows, ranking, and deterministic deduplication
6. Data-quality rules, quarantine, and reconciliation boundaries
7. Dimensional outputs, measures, and consumer-oriented data contracts
8. Worked silver/gold flow: order detail, customer attributes, and sales summaries

Worked illustrations: SQL and PySpark side by side with small input/output tables; an inflated-total join failure; a tie-breaking deduplication example; quality-rule outcomes; an order-detail-to-sales reconciliation. Reference the SQL and Spark courses for full foundations rather than repeating their internals.

Outcome: Explain and construct representative transformations, predict grain-related errors, and justify business measures and quality decisions.

Bridge: Batch transformations define intended results; next we explain how those results stay correct as events and source records change.

## Chapter 6 — Streaming, CDC, and Changing State

Objective: Explain incremental correctness under time, ordering, mutation, and recovery constraints.

1. Full recomputation, incremental processing, and append-only assumptions
2. Event time, processing time, late data, and watermarks
3. Stateful aggregation and deduplication: state size and expiry
4. Streaming joins and bounded-state assumptions
5. Checkpoints, restarts, and compatible query changes
6. Sink effects, foreachBatch, idempotency, and delivery guarantees
7. Source CDC: keys, operation types, sequence ordering, and deletes
8. SCD type 1 versus type 2 and historical correctness
9. Table CDF versus source CDC: snapshots, versions, and replay windows
10. Worked recovery: duplicates, out-of-order changes, and unavailable history

Worked illustrations: Event and state timelines; annotated streaming reads/writes; CDC update/delete records; SCD1 and SCD2 result tables; a restart trace. Explicitly state whether a CDF example uses a configured legacy feed or an eligible automatic feed and verify its runtime/table requirements.

Outcome: Trace changing data through state and tables, explain late/duplicate/delete handling, and identify the assumptions needed for a safe restart or replay.

Bridge: The change-processing rules are explicit; next we express them through managed declarative pipeline abstractions.

## Chapter 7 — Declarative Data Pipelines

Objective: Explain how dataset declarations become managed dependencies, updates, and quality behaviour.

1. Imperative Spark applications versus declarative pipeline definitions
2. Streaming tables, materialized views, and views: different responsibilities
3. Dataset dependencies, flows, and supported sinks
4. Expectations, quality outcomes, and quarantine design
5. Incremental processing, recomputation, and source-change semantics
6. AUTO CDC and SCD definitions with explicit keys and sequencing
7. Updates, refresh scope, full refresh, and replay consequences
8. Pipeline event logs, failure interpretation, and an annotated pipeline walkthrough

Worked illustrations: SQL/Python definitions and their generated dependency diagram; rows retained/dropped/rejected under quality policies; an AUTO CDC sequence; incremental update versus full-refresh timelines; illustrative event-log records. Use current API names and label older DLT terminology only for recognition.

Outcome: Interpret a declarative pipeline, explain its dataset and quality choices, and compare incremental or refresh behaviour without assuming all queries refresh identically.

Bridge: A pipeline manages its internal dependencies; next we coordinate it with other workloads and upstream/downstream responsibilities.

## Chapter 8 — Orchestration and Workload Dependencies

Objective: Explain scheduled work, dependency control, and recovery across multiple tasks.

1. Jobs and task DAGs: notebook, pipeline, SQL, and packaged-code roles
2. Parameters, task values, and environment-specific inputs
3. Schedules, event triggers, and freshness/cost trade-offs
4. Conditional execution, loops, dependencies, and failure paths
5. Retries, repair runs, reruns, and application idempotency
6. Run-as identities, ownership, permissions, and credential boundaries
7. Worked orchestration: ingest, transform, validate, and publish dependencies

Worked illustrations: An annotated job definition and DAG; parameter propagation; a failed-middle-task trace comparing repair and full rerun; a run-as permission failure. Distinguish orchestration recovery from exactly-once business effects.

Outcome: Interpret job dependencies and identity, compare retry/repair choices, and explain what must remain idempotent after a partial failure.

Bridge: The work is coordinated; next we inspect execution evidence and choose improvements that meet latency and cost requirements.

## Chapter 9 — Performance, Layout, and Cost

Objective: Compare improvements using execution evidence and explicit workload requirements.

1. Correctness baselines, representative workloads, and measurement limits
2. Spark UI and SQL query profiles: locating expensive work
3. Compute sizing, serverless choices, Photon, and feature eligibility
4. Join strategies, skew, shuffles, and unnecessary computation
5. Small files, compaction, and write/read trade-offs
6. Partitioning, liquid clustering, data skipping, and pruning
7. Predictive optimisation and automatic maintenance: responsibilities and eligibility
8. Worked comparison: freshness, runtime, throughput, and cost assumptions

Worked illustrations: Supplied UI/profile excerpts; alternative join plans; a skewed task distribution; before/after file layouts; a clustering-key rationale; hypothetical cost calculations with labelled assumptions rather than quoted prices. Avoid applying partitioning, Z-ordering, and liquid clustering as interchangeable recipes.

Outcome: Explain a plausible bottleneck and compare workload, layout, compute, and automation choices using evidence and stated eligibility assumptions.

Bridge: Performance changes must survive deployment and failure; next we connect development, access, monitoring, and recovery into an operational process.

## Chapter 10 — Development, Deployment, and Operations

Objective: Explain how engineering controls support repeatable delivery and safe operation.

1. Modular code, Git integration, notebooks, and local/remote development boundaries
2. Libraries, environments, wheels, runtime compatibility, and dependency isolation
3. Unit, integration, and data-quality tests as worked reliability techniques
4. Declarative Automation Bundles: resources, configuration, and deployment intent
5. Development/staging/production targets, CI/CD, validation, and promotion
6. Observability: logs, metrics, lineage, audit records, and system-table concepts
7. Incident diagnosis, alerting, freshness, and data-quality objectives
8. Recovery, backfills, checkpoints, retention, and deletion obligations
9. Secrets, service principals, least privilege, and deployment/run identities
10. Operational ownership, capacity, cost attribution, and an incident walkthrough

Worked illustrations: A project tree and annotated bundle YAML; a test comparison for expected versus actual records; a promotion/rollback diagram; a failed deployment or expired-identity trace; a lag/retention incident timeline; a responsibility matrix. No workspace deployment, publication, or cloud change is performed as part of this TOC.

Outcome: Interpret a repeatable delivery design, explain testing and operational signals, and justify recovery and access decisions across environments.

Bridge: Individual controls are connected; next we assess a complete data product under changed requirements and realistic failures.

## Chapter 11 — Integrated Engineering Decisions

Objective: Integrate platform choices into a coherent design and explain alternatives.

1. End-to-end retail pipeline: source contracts through governed consumption
2. Changed requirements: latency, scale, new sources, and historical corrections
3. Compare notebooks/jobs, declarative pipelines, and managed ingestion
4. Failure and recovery critique: missing data, duplicates, drift, and access loss
5. Decision record: alternatives, guarantees, cost assumptions, and unresolved risks

Worked illustrations: A complete architecture and DAG; representative SQL, PySpark, configuration, and result tables; a CDC history trace; a changed-requirements redesign. Explain why a component is present and which guarantee comes from storage, processing, orchestration, or an external source.

Outcome: Explain and critique the complete retail design, construct representative components from examples, and justify changes when requirements or failure assumptions change.

Bridge: Continue with unfamiliar sources and operating scenarios; deepen practical competence through separate implementation experience and feedback.

## Sources and scope

Primary sources include the official [data-engineering overview](https://docs.databricks.com/aws/en/data-engineering), [Unity Catalog](https://docs.databricks.com/aws/en/data-governance/unity-catalog/), [Delta Lake](https://docs.databricks.com/aws/en/delta/), [Auto Loader](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/), [Lakeflow pipeline concepts](https://docs.databricks.com/aws/en/ldp/concepts), [Lakeflow Jobs](https://docs.databricks.com/aws/en/jobs/), and [Declarative Automation Bundles](https://docs.databricks.com/aws/en/dev-tools/bundles/). Selected guides clarify change feeds, retention, CDC, pipeline updates, job identities/repair, clustering, and automatic optimisation.

Publisher contents were compared for [Delta Lake: The Definitive Guide](https://www.oreilly.com/library/view/delta-lake-the/9781098151935/) (2024) and [Learning Spark, second edition](https://www.oreilly.com/library/view/learning-spark-2nd/9781492050032/) (2020). Full book text was not accessed; current Databricks behaviour comes from primary documentation rather than older book terminology. The identified Associate and Professional guides were secondary coverage checks only. Detailed sources, research gaps, and review tracking are in [README.md](../README.md).

ML/AI, comprehensive BI authoring, every connector/API option, cloud account/network administration, certification preparation, and full legacy-interface coverage are outside scope. Visual/AI-assisted authoring, federation, sharing, and specialised table formats receive comparison-level coverage where relevant. Preview or runtime-specific functionality must be labelled and is not assumed in baseline examples. Lesson authoring still requires exact syntax and eligibility checks; this TOC delivers no executed pipelines, tested deployments, or measured performance claims.
