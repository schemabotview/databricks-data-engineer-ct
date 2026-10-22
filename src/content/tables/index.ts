import type { Course } from '../types'
import { filesLogSnapshots } from './01-files-log-snapshots'
import { acidAndConcurrentWrites } from './02-acid-and-concurrent-writes'
import { schemaEnforcement } from './03-schema-enforcement'
import { dmlAndMerge } from './04-dml-and-merge'
import { historyAndRestore } from './05-history-and-restore'
import { retentionAndVacuum } from './06-retention-and-vacuum'
import { changeDataFeed } from './07-change-data-feed'
import { tableFeatures } from './08-table-features'

export const tables: Course = {
  id: 'tables',
  title: 'Make the table reliable',
  sections: [filesLogSnapshots, acidAndConcurrentWrites, schemaEnforcement, dmlAndMerge, historyAndRestore, retentionAndVacuum, changeDataFeed, tableFeatures],
}
