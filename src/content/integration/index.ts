import type { Course } from '../types'
import { endToEndRetailPipeline } from './01-end-to-end-retail-pipeline'
import { changedRequirements } from './02-changed-requirements'
import { notebooksPipelinesIngestion } from './03-notebooks-pipelines-ingestion'
import { failureRecoveryCritique } from './04-failure-recovery-critique'
import { decisionRecord } from './05-decision-record'

// Chapter 11 of docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md — one section per numbered item, in plan order.
// Objective: Integrate platform choices into a coherent design and explain alternatives.
// Outcome: Explain and critique the complete retail design, construct representative components from
//   examples, and justify changes when requirements or failure assumptions change.
// Worked illustrations (plan): a complete architecture and DAG; representative SQL, PySpark, configuration
//   and result tables; a CDC history trace; a changed-requirements redesign. Each component is tied to the
//   kind of guarantee it provides: storage, processing, orchestration or an external source.
// Bridge: Continue with unfamiliar sources and operating scenarios; deepen practical competence through
//   separate implementation experience and feedback. (Also the last words of the final narration.)
// STATUS: the changed-requirements results are a LOCAL run reusing examples/retail_etl
//   (scripts/verify/ch11_integration.py). The critique and decision record cite earlier chapters' local
//   results and models. Unity Catalog, Auto Loader, pipelines, Jobs and bundles remain DOCUMENTED, NOT RUN.
export const integration: Course = {
  id: 'integration',
  title: 'Integrated Engineering Decisions',
  sections: [
    endToEndRetailPipeline,
    changedRequirements,
    notebooksPipelinesIngestion,
    failureRecoveryCritique,
    decisionRecord,
  ],
}
