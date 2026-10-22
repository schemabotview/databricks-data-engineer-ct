import type { Course } from '../types'
import { sourceContracts } from './01-source-contracts'
import { batchLoads } from './02-batch-loads'
import { autoLoaderSection } from './03-auto-loader'
import { fileDiscoveryAndCheckpoints } from './04-file-discovery-and-checkpoints'
import { schemaInferenceAndDrift } from './05-schema-inference-and-drift'
import { malformedRecords } from './06-malformed-records'
import { managedConnectors } from './07-managed-connectors'
import { messageBuses } from './08-message-buses'
import { bronzeWalkthrough } from './09-bronze-walkthrough'

export const ingest: Course = {
  id: 'ingest',
  title: 'Bring the data in',
  sections: [sourceContracts, batchLoads, autoLoaderSection, fileDiscoveryAndCheckpoints, schemaInferenceAndDrift, malformedRecords, managedConnectors, messageBuses, bronzeWalkthrough],
}
