import type { Scene } from '@graphlearning/flow'
import { ucHierarchy } from './uc-hierarchy'
import { tablesVsVolumes } from './tables-vs-volumes'
import { managedVsExternal } from './managed-vs-external'
import { leastPrivilege } from './least-privilege'
import { storageBoundaries } from './storage-boundaries'
import { lineageAudit } from './lineage-audit'
import { shareVsFederate } from './share-vs-federate'

// One bundle per course folder, spread into src/scenes/index.ts.
export const governanceScenes: Scene[] = [
  ucHierarchy,
  tablesVsVolumes,
  managedVsExternal,
  leastPrivilege,
  storageBoundaries,
  lineageAudit,
  shareVsFederate,
]
