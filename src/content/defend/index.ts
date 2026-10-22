import type { Course } from '../types'
import { endToEnd } from './01-end-to-end'
import { changedRequirements } from './02-changed-requirements'
import { jobsPipelinesOrManagedIngestion } from './03-jobs-pipelines-or-managed-ingestion'
import { failureAndRecoveryCritique } from './04-failure-and-recovery-critique'
import { theDecisionRecord } from './05-the-decision-record'

export const defend: Course = {
  id: 'defend',
  title: 'Defend the design',
  sections: [endToEnd, changedRequirements, jobsPipelinesOrManagedIngestion, failureAndRecoveryCritique, theDecisionRecord],
}
