import type { Course } from '../types'
import { dataEngineeringRequirements } from './01-data-engineering-requirements'
import { lakehouseConcepts } from './02-lakehouse-concepts'
import { accountsWorkspacesBoundaries } from './03-accounts-workspaces-boundaries'
import { computeChoices } from './04-compute-choices'
import { firstQuery } from './05-first-query'
import { layeredDataProducts } from './06-layered-data-products'

// Chapter 1 of docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md — one section per numbered item, in plan order.
// Objective: Explain the platform's responsibilities and follow a small dataset from source to query.
// Outcome: Explain where code runs and data resides, interpret a simple flow, and justify a
//   provisional compute and layering choice.
// Worked illustrations (plan): a source-to-query diagram; a small order dataset and its first
//   SQL/PySpark result; a compute-choice table. Separate storage from compute, and explain why layer
//   names do not themselves provide transactional guarantees.
// Bridge: The flow needs named data objects and authorised access; next we establish governance
//   before ingestion. (Also the last words of the final narration.)
export const foundations: Course = {
  id: 'foundations',
  title: 'Platform Foundations and a First Data Flow',
  sections: [
    dataEngineeringRequirements,
    lakehouseConcepts,
    accountsWorkspacesBoundaries,
    computeChoices,
    firstQuery,
    layeredDataProducts,
  ],
}
