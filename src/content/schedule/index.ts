import type { Course } from '../types'
import { jobsAndTaskDags } from './01-jobs-and-task-dags'
import { parametersAndTaskValues } from './02-parameters-and-task-values'
import { schedulesAndTriggers } from './03-schedules-and-triggers'
import { conditionsAndFailurePaths } from './04-conditions-and-failure-paths'
import { retriesRepairAndIdempotency } from './05-retries-repair-and-idempotency'
import { runAsIdentities } from './06-run-as-identities'
import { theOrchestratedFlow } from './07-the-orchestrated-flow'

export const schedule: Course = {
  id: 'schedule',
  title: 'Schedule it',
  sections: [jobsAndTaskDags, parametersAndTaskValues, schedulesAndTriggers, conditionsAndFailurePaths, retriesRepairAndIdempotency, runAsIdentities, theOrchestratedFlow],
}
