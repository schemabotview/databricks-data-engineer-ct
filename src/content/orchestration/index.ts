import type { Course } from '../types'
import { jobsAndTaskDags } from './01-jobs-and-task-dags'
import { parametersTaskValues } from './02-parameters-task-values'
import { schedulesTriggersCost } from './03-schedules-triggers-cost'
import { conditionsFailurePaths } from './04-conditions-failure-paths'
import { retriesRepairIdempotency } from './05-retries-repair-idempotency'
import { runAsIdentities } from './06-run-as-identities'
import { workedOrchestration } from './07-worked-orchestration'

// Chapter 8 of docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md — one section per numbered item, in plan order.
// Objective: Explain scheduled work, dependency control, and recovery across multiple tasks.
// Outcome: Interpret job dependencies and identity, compare retry/repair choices, and explain what must
//   remain idempotent after a partial failure.
// Worked illustrations (plan): an annotated job definition and DAG; parameter propagation; a
//   failed-middle-task trace comparing repair and full rerun; a run-as permission failure. Orchestration
//   recovery is distinguished from exactly-once business effects.
// Bridge: The work is coordinated; next we inspect execution evidence and choose improvements that meet
//   latency and cost requirements. (Also the last words of the final narration.)
// STATUS: Databricks Jobs is DOCUMENTED, NOT RUN (no workspace). A LOCAL MODEL of the documented
//   semantics, with real Delta effects, is asserted by scripts/verify/ch08_orchestration_model.py; the
//   run-as refusal reuses the Chapter 2 permission model. Unverified: task-values spelling, run-as wording.
export const orchestration: Course = {
  id: 'orchestration',
  title: 'Orchestration and Workload Dependencies',
  sections: [
    jobsAndTaskDags,
    parametersTaskValues,
    schedulesTriggersCost,
    conditionsFailurePaths,
    retriesRepairIdempotency,
    runAsIdentities,
    workedOrchestration,
  ],
}
