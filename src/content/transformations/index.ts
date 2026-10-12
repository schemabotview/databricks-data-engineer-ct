import type { Course } from '../types'
import { sparkModelForTransformations } from './01-spark-model-for-transformations'
import { sqlAndDataframeEquivalence } from './02-sql-and-dataframe-equivalence'
import { parsingTypesNullTime } from './03-parsing-types-null-time'
import { joinsKeysCardinality } from './04-joins-keys-cardinality'
import { windowsRankingDedupe } from './05-windows-ranking-dedupe'
import { qualityRulesQuarantine } from './06-quality-rules-quarantine'
import { dimensionalOutputsContracts } from './07-dimensional-outputs-contracts'
import { workedSilverGoldFlow } from './08-worked-silver-gold-flow'

// Chapter 5 of docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md — one section per numbered item, in plan order.
// Objective: Construct understandable transformations that preserve grain and business meaning.
// Outcome: Explain and construct representative transformations, predict grain-related errors, and
//   justify business measures and quality decisions.
// Worked illustrations (plan): SQL and PySpark side by side with small input/output tables; an
//   inflated-total join failure; a tie-breaking deduplication example; quality-rule outcomes; an
//   order-detail-to-sales reconciliation. The SQL and Spark courses hold the full foundations.
// Bridge: Batch transformations define intended results; next we explain how those results stay
//   correct as events and source records change. (Also the last words of the final narration.)
// STATUS: every output is from a LOCAL run (PySpark 4.0.1 + Delta 4.0.0), asserted by
//   scripts/verify/ch05_transformations.py. The plan's "customer attributes" are covered by the store
//   reference join, because the retail sample carries stores, not customers.
export const transformations: Course = {
  id: 'transformations',
  title: 'Transformations and Business Data Products',
  sections: [
    sparkModelForTransformations,
    sqlAndDataframeEquivalence,
    parsingTypesNullTime,
    joinsKeysCardinality,
    windowsRankingDedupe,
    qualityRulesQuarantine,
    dimensionalOutputsContracts,
    workedSilverGoldFlow,
  ],
}
