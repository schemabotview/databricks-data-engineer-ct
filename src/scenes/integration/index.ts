import type { Scene } from '@graphlearning/flow'
import { architectureGuarantees } from './architecture-guarantees'
import { changedRequirements } from './changed-requirements'
import { designOptions } from './design-options'
import { failureCritique } from './failure-critique'
import { decisionRecord } from './decision-record'

// One bundle per course folder, spread into src/scenes/index.ts.
export const integrationScenes: Scene[] = [
  architectureGuarantees,
  changedRequirements,
  designOptions,
  failureCritique,
  decisionRecord,
]
