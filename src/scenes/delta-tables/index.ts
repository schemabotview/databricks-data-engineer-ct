import type { Scene } from '@graphlearning/flow'
import { deltaVersions } from './delta-versions'
import { writeConflict } from './write-conflict'
import { schemaContract } from './schema-contract'
import { dmlSemantics } from './dml-semantics'
import { historyRestore } from './history-restore'
import { retentionTimeline } from './retention-timeline'
import { changeFeed } from './change-feed'
import { tableFeatures } from './table-features'

// One bundle per course folder, spread into src/scenes/index.ts.
export const deltaTablesScenes: Scene[] = [
  deltaVersions,
  writeConflict,
  schemaContract,
  dmlSemantics,
  historyRestore,
  retentionTimeline,
  changeFeed,
  tableFeatures,
]
