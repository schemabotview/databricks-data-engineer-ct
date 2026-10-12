import type { Scene } from '@graphlearning/flow'
import { sparkPlanModel } from './spark-plan-model'
import { sqlDfEquivalence } from './sql-df-equivalence'
import { typesNullsTime } from './types-nulls-time'
import { joinCardinality } from './join-cardinality'
import { windowDedupe } from './window-dedupe'
import { qualityQuarantine } from './quality-quarantine'
import { goldContract } from './gold-contract'
import { silverGoldFlow } from './silver-gold-flow'

// One bundle per course folder, spread into src/scenes/index.ts.
export const transformationsScenes: Scene[] = [
  sparkPlanModel,
  sqlDfEquivalence,
  typesNullsTime,
  joinCardinality,
  windowDedupe,
  qualityQuarantine,
  goldContract,
  silverGoldFlow,
]
