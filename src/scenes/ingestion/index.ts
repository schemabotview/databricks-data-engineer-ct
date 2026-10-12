import type { Scene } from '@graphlearning/flow'
import { sourceContract } from './source-contract'
import { batchLoad } from './batch-load'
import { autoLoader } from './auto-loader'
import { fileProgress } from './file-progress'
import { schemaDrift } from './schema-drift'
import { rescuedQuarantine } from './rescued-quarantine'
import { connectorMatrix } from './connector-matrix'
import { messageBus } from './message-bus'
import { bronzeWalkthrough } from './bronze-walkthrough'

// One bundle per course folder, spread into src/scenes/index.ts.
export const ingestionScenes: Scene[] = [
  sourceContract,
  batchLoad,
  autoLoader,
  fileProgress,
  schemaDrift,
  rescuedQuarantine,
  connectorMatrix,
  messageBus,
  bronzeWalkthrough,
]
