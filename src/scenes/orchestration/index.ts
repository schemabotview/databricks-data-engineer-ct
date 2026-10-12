import type { Scene } from '@graphlearning/flow'
import { jobDag } from './job-dag'
import { parametersValues } from './parameters-values'
import { triggersFreshness } from './triggers-freshness'
import { failurePaths } from './failure-paths'
import { repairIdempotency } from './repair-idempotency'
import { runAsPermissions } from './run-as-permissions'
import { orchestrationWalkthrough } from './orchestration-walkthrough'

// One bundle per course folder, spread into src/scenes/index.ts.
export const orchestrationScenes: Scene[] = [
  jobDag,
  parametersValues,
  triggersFreshness,
  failurePaths,
  repairIdempotency,
  runAsPermissions,
  orchestrationWalkthrough,
]
