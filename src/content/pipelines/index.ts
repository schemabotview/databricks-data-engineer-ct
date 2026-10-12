import type { Course } from '../types'
import { imperativeVsDeclarative } from './01-imperative-vs-declarative'
import { streamingTablesViews } from './02-streaming-tables-views'
import { dependenciesFlowsSinks } from './03-dependencies-flows-sinks'
import { expectationsQualityQuarantine } from './04-expectations-quality-quarantine'
import { incrementalRecomputeSemantics } from './05-incremental-recompute-semantics'
import { autoCdcScd } from './06-auto-cdc-scd'
import { updatesRefreshReplay } from './07-updates-refresh-replay'
import { eventLogsWalkthrough } from './08-event-logs-walkthrough'

// Chapter 7 of docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md — one section per numbered item, in plan order.
// Objective: Explain how dataset declarations become managed dependencies, updates, and quality behaviour.
// Outcome: Interpret a declarative pipeline, explain its dataset and quality choices, and compare
//   incremental or refresh behaviour without assuming all queries refresh identically.
// Worked illustrations (plan): SQL/Python definitions and their generated dependency diagram; rows
//   retained/dropped/rejected under quality policies; an AUTO CDC sequence; incremental update versus
//   full-refresh timelines; illustrative event-log records. Current API names; older DLT terminology is
//   labelled only for recognition.
// Bridge: A pipeline manages its internal dependencies; next we coordinate it with other workloads and
//   upstream/downstream responsibilities. (Also the last words of the final narration.)
// STATUS: DOCUMENTED, NOT RUN — no Databricks workspace. Names were checked through search summaries of
//   the Databricks docs (docs.databricks.com was unreachable): `from pyspark import pipelines as dp`,
//   CREATE FLOW ... AS AUTO CDC INTO ... KEYS / SEQUENCE BY / STORED AS SCD TYPE 1|2, expectations
//   warn/drop/fail. LOCAL: the policy arithmetic and the Delta source-update rule
//   (scripts/verify/ch07_pipelines_local.py). Re-verify everything against the live docs.
export const pipelines: Course = {
  id: 'pipelines',
  title: 'Declarative Data Pipelines',
  sections: [
    imperativeVsDeclarative,
    streamingTablesViews,
    dependenciesFlowsSinks,
    expectationsQualityQuarantine,
    incrementalRecomputeSemantics,
    autoCdcScd,
    updatesRefreshReplay,
    eventLogsWalkthrough,
  ],
}
