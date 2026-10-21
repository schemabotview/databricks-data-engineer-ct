import type { Course } from '../types'
import { threePartNames } from './01-three-part-names'
import { tablesViewsVolumes } from './02-tables-views-volumes'
import { managedAndExternal } from './03-managed-and-external'
import { principalsAndPrivileges } from './04-principals-and-privileges'
import { storageCredentialsAndLocations } from './05-storage-credentials-and-locations'
import { discoveryLineageAudit } from './06-discovery-lineage-audit'
import { sharingAndFederation } from './07-sharing-and-federation'

export const govern: Course = {
  id: 'govern',
  title: 'Govern it',
  sections: [threePartNames, tablesViewsVolumes, managedAndExternal, principalsAndPrivileges, storageCredentialsAndLocations, discoveryLineageAudit, sharingAndFederation],
}
