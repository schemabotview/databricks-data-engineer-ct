import type { Course } from '../types'
import { aCorrectBaseline } from './01-a-correct-baseline'
import { readingExecutionEvidence } from './02-reading-execution-evidence'
import { computeSizingServerlessAndPhoton } from './03-compute-sizing-serverless-and-photon'
import { joinsSkewAndShuffles } from './04-joins-skew-and-shuffles'
import { smallFilesAndCompaction } from './05-small-files-and-compaction'
import { partitioningLiquidClusteringAndSkipping } from './06-partitioning-liquid-clustering-and-skipping'
import { predictiveOptimization } from './07-predictive-optimization'
import { aWorkedComparison } from './08-a-worked-comparison'

export const fast: Course = {
  id: 'fast',
  title: 'Make it fast and cheap',
  sections: [aCorrectBaseline, readingExecutionEvidence, computeSizingServerlessAndPhoton, joinsSkewAndShuffles, smallFilesAndCompaction, partitioningLiquidClusteringAndSkipping, predictiveOptimization, aWorkedComparison],
}
