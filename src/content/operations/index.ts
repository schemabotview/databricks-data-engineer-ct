import type { Course } from '../types'
import { modularCodeGit } from './01-modular-code-git'
import { librariesWheelsEnvironments } from './02-libraries-wheels-environments'
import { testingReliability } from './03-testing-reliability'
import { declarativeAutomationBundles } from './04-declarative-automation-bundles'
import { environmentsCicdPromotion } from './05-environments-cicd-promotion'
import { observability } from './06-observability'
import { incidentsAlertingObjectives } from './07-incidents-alerting-objectives'
import { recoveryBackfillsDeletion } from './08-recovery-backfills-deletion'
import { secretsIdentitiesLeastPrivilege } from './09-secrets-identities-least-privilege'
import { ownershipIncidentWalkthrough } from './10-ownership-incident-walkthrough'

// Chapter 10 of docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md — one section per numbered item, in plan order.
// Objective: Explain how engineering controls support repeatable delivery and safe operation.
// Outcome: Interpret a repeatable delivery design, explain testing and operational signals, and justify
//   recovery and access decisions across environments.
// Worked illustrations (plan): a project tree and annotated bundle YAML; a test comparison for expected
//   versus actual records; a promotion/rollback diagram; a failed-deployment or expired-identity trace; a
//   lag/retention incident timeline; a responsibility matrix. No workspace deployment, publication or cloud
//   change was performed.
// Bridge: Individual controls are connected; next we assess a complete data product under changed
//   requirements and realistic failures. (Also the last words of the final narration.)
// STATUS: LOCAL and real — examples/retail_etl (7 passing tests, a buggy-variant diff, a built wheel) and a
//   deletion-obligation demonstration (scripts/verify/ch10_operations.py). DOCUMENTED, NOT RUN: bundles
//   (examples/retail_etl/databricks.yml is NOT validated), deployment, CI, system tables, secrets, run-as.
//   Unverified: audit/lineage table names, secret redaction wording, the expired-credential error shape.
export const operations: Course = {
  id: 'operations',
  title: 'Development, Deployment, and Operations',
  sections: [
    modularCodeGit,
    librariesWheelsEnvironments,
    testingReliability,
    declarativeAutomationBundles,
    environmentsCicdPromotion,
    observability,
    incidentsAlertingObjectives,
    recoveryBackfillsDeletion,
    secretsIdentitiesLeastPrivilege,
    ownershipIncidentWalkthrough,
  ],
}
