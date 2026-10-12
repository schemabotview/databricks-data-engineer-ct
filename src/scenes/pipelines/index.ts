import type { Scene } from '@graphlearning/flow'
import { imperativeVsDeclarative } from './imperative-vs-declarative'
import { datasetKinds } from './dataset-kinds'
import { pipelineGraph } from './pipeline-graph'
import { expectationPolicies } from './expectation-policies'
import { incrementalSemantics } from './incremental-semantics'
import { autoCdcSequence } from './auto-cdc-sequence'
import { refreshModes } from './refresh-modes'
import { pipelineWalkthrough } from './pipeline-walkthrough'

// One bundle per course folder, spread into src/scenes/index.ts.
export const pipelinesScenes: Scene[] = [
  imperativeVsDeclarative,
  datasetKinds,
  pipelineGraph,
  expectationPolicies,
  incrementalSemantics,
  autoCdcSequence,
  refreshModes,
  pipelineWalkthrough,
]
