import type { Course } from '../types'
import { metastoresCatalogsSchemas } from './01-metastores-catalogs-schemas'
import { tablesViewsVolumes } from './02-tables-views-volumes'
import { managedVsExternal } from './03-managed-vs-external'
import { principalsAndPrivileges } from './04-principals-and-privileges'
import { storageCredentialsAndLocations } from './05-storage-credentials-and-locations'
import { discoveryLineageAudit } from './06-discovery-lineage-audit'
import { sharingVsFederation } from './07-sharing-vs-federation'

// Chapter 2 of docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md — one section per numbered item, in plan order.
// Objective: Explain data ownership and access across logical objects and storage boundaries.
// Outcome: Interpret object names and grants, distinguish managed/external responsibilities, and
//   explain which identity and storage boundary governs an operation.
// Worked illustrations (plan): a catalog/schema/object tree; sample CREATE and GRANT statements; a
//   permission matrix; table-versus-volume access examples; a denied-access trace; a lineage diagram.
//   Workspace, Unity Catalog and cloud controls are explained separately.
// Bridge: Governance defines who can access data; next we explain the table semantics that make
//   changes reliable. (Also the last words of the final narration.)
// STATUS: every example is DOCUMENTED, NOT EXECUTED — no Unity Catalog metastore was available.
export const governance: Course = {
  id: 'governance',
  title: 'Governed Data and Unity Catalog',
  sections: [
    metastoresCatalogsSchemas,
    tablesViewsVolumes,
    managedVsExternal,
    principalsAndPrivileges,
    storageCredentialsAndLocations,
    discoveryLineageAudit,
    sharingVsFederation,
  ],
}
