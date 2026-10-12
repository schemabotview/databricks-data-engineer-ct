import type { Course } from '../types'
import { baselinesAndMeasurement } from './01-baselines-and-measurement'
import { sparkUiQueryProfiles } from './02-spark-ui-query-profiles'
import { computeSizingPhoton } from './03-compute-sizing-photon'
import { joinsSkewShuffles } from './04-joins-skew-shuffles'
import { smallFilesCompaction } from './05-small-files-compaction'
import { partitioningClusteringSkipping } from './06-partitioning-clustering-skipping'
import { predictiveOptimization } from './07-predictive-optimization'
import { workedComparison } from './08-worked-comparison'

// Chapter 9 of docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md — one section per numbered item, in plan order.
// Objective: Compare improvements using execution evidence and explicit workload requirements.
// Outcome: Explain a plausible bottleneck and compare workload, layout, compute, and automation choices
//   using evidence and stated eligibility assumptions.
// Worked illustrations (plan): supplied UI/profile excerpts; alternative join plans; a skewed task
//   distribution; before/after file layouts; a clustering-key rationale; hypothetical cost calculations
//   with labelled assumptions rather than quoted prices. Partitioning, Z-ordering and liquid clustering
//   are not presented as interchangeable recipes.
// Bridge: Performance changes must survive deployment and failure; next we connect development, access,
//   monitoring, and recovery into an operational process. (Also the last words of the final narration.)
// STATUS: LOCAL counts only (PySpark 4.0.1 + Delta 4.0.0, scripts/verify/ch09_performance.py) — no timing
//   is quoted anywhere. Photon, serverless sizing and predictive optimisation are DOCUMENTED, NOT RUN,
//   per search summaries of the docs. The cost table is HYPOTHETICAL: only files-read is measured.
export const performance: Course = {
  id: 'performance',
  title: 'Performance, Layout, and Cost',
  sections: [
    baselinesAndMeasurement,
    sparkUiQueryProfiles,
    computeSizingPhoton,
    joinsSkewShuffles,
    smallFilesCompaction,
    partitioningClusteringSkipping,
    predictiveOptimization,
    workedComparison,
  ],
}
