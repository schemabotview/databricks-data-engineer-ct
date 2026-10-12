import type { Course } from '../types'
import { sourceContracts } from './01-source-contracts'
import { batchLoadsCopyInto } from './02-batch-loads-copy-into'
import { autoLoaderCloudfiles } from './03-auto-loader-cloudfiles'
import { fileDiscoveryCheckpoints } from './04-file-discovery-checkpoints'
import { schemaInferenceEvolution } from './05-schema-inference-evolution'
import { rescuedDataQuarantine } from './06-rescued-data-quarantine'
import { managedConnectorsLakeflowConnect } from './07-managed-connectors-lakeflow-connect'
import { messageBusStreamingSources } from './08-message-bus-streaming-sources'
import { backfillsReplayBronzeWalkthrough } from './09-backfills-replay-bronze-walkthrough'

// Chapter 4 of docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md — one section per numbered item, in plan order.
// Objective: Compare ingestion methods and explain progress tracking, schema drift, and replay.
// Outcome: Compare ingestion options, trace progress after restart, and explain how schema drift,
//   duplicate inputs, or source retention affects completeness.
// Worked illustrations (plan): annotated batch SQL and Auto Loader PySpark; a file-arrival timeline;
//   schema/rescued-record examples; source-to-bronze counts; a connector responsibility matrix.
//   Pipeline-managed state is distinguished from application-managed checkpoints, and processing
//   guarantees are qualified by source and destination.
// Bridge: Raw arrival is accounted for; next we turn it into correct and useful business records.
//   (Also the last words of the final narration.)
// STATUS: local runs use Spark's FILE STREAM source, batch reads and PERMISSIVE parsing (asserted by
//   scripts/verify/ch04_ingestion.py). Auto Loader, COPY INTO, _rescued_data, managed connectors and
//   message-bus reads are DOCUMENTED, NOT RUN.
export const ingestion: Course = {
  id: 'ingestion',
  title: 'Ingestion and Incremental Arrival',
  sections: [
    sourceContracts,
    batchLoadsCopyInto,
    autoLoaderCloudfiles,
    fileDiscoveryCheckpoints,
    schemaInferenceEvolution,
    rescuedDataQuarantine,
    managedConnectorsLakeflowConnect,
    messageBusStreamingSources,
    backfillsReplayBronzeWalkthrough,
  ],
}
