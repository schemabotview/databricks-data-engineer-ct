import type { Scene } from '@graphlearning/flow'
import { baselineChecks } from './baseline-checks'
import { stageMetrics } from './stage-metrics'
import { parallelismSizing } from './parallelism-sizing'
import { joinSkew } from './join-skew'
import { fileLayout } from './file-layout'
import { skippingLayouts } from './skipping-layouts'
import { autoMaintenance } from './auto-maintenance'
import { costComparison } from './cost-comparison'

// One bundle per course folder, spread into src/scenes/index.ts.
export const performanceScenes: Scene[] = [
  baselineChecks,
  stageMetrics,
  parallelismSizing,
  joinSkew,
  fileLayout,
  skippingLayouts,
  autoMaintenance,
  costComparison,
]
