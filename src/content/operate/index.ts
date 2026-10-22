import type { Course } from '../types'
import { modularCode } from './01-modular-code'
import { wheelsAndEnvironments } from './02-wheels-and-environments'
import { testsSection } from './03-tests'
import { declarativeAutomationBundles } from './04-declarative-automation-bundles'
import { targetsCiAndPromotion } from './05-targets-ci-and-promotion'
import { observabilitySection } from './06-observability'
import { incidentsAndObjectives } from './07-incidents-and-objectives'
import { recoveryAndDeletion } from './08-recovery-and-deletion'
import { secretsAndIdentities } from './09-secrets-and-identities'
import { ownershipAndCostAttribution } from './10-ownership-and-cost-attribution'

export const operate: Course = {
  id: 'operate',
  title: 'Ship and operate it',
  sections: [modularCode, wheelsAndEnvironments, testsSection, declarativeAutomationBundles, targetsCiAndPromotion, observabilitySection, incidentsAndObjectives, recoveryAndDeletion, secretsAndIdentities, ownershipAndCostAttribution],
}
