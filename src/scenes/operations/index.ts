import type { Scene } from '@graphlearning/flow'
import { projectLayout } from './project-layout'
import { wheelEnvironments } from './wheel-environments'
import { testLayers } from './test-layers'
import { bundleConfig } from './bundle-config'
import { promotionRollback } from './promotion-rollback'
import { observabilitySources } from './observability-sources'
import { objectivesAlerts } from './objectives-alerts'
import { deletionRecovery } from './deletion-recovery'
import { secretsIdentities } from './secrets-identities'
import { opsOwnership } from './ops-ownership'

// One bundle per course folder, spread into src/scenes/index.ts.
export const operationsScenes: Scene[] = [
  projectLayout,
  wheelEnvironments,
  testLayers,
  bundleConfig,
  promotionRollback,
  observabilitySources,
  objectivesAlerts,
  deletionRecovery,
  secretsIdentities,
  opsOwnership,
]
