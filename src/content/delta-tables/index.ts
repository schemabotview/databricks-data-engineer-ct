import type { Course } from '../types'
import { filesLogsSnapshots } from './01-files-logs-snapshots'
import { acidConcurrentWrites } from './02-acid-concurrent-writes'
import { schemaEnforcementEvolution } from './03-schema-enforcement-evolution'
import { dmlAndMerge } from './04-dml-and-merge'
import { historyTimeTravelRestore } from './05-history-time-travel-restore'
import { retentionAndVacuum } from './06-retention-and-vacuum'
import { changeDataFeed } from './07-change-data-feed'
import { tableFeaturesCompatibility } from './08-table-features-compatibility'

// Chapter 3 of docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md — one section per numbered item, in plan order.
// Objective: Explain transactional table behaviour and its retention and compatibility limits.
// Outcome: Interpret table versions and changes, explain schema and concurrency decisions, and identify
//   retention or compatibility assumptions behind recovery.
// Worked illustrations (plan): a table-snapshot diagram and version sequence; DML with before/after
//   rows; conflicting writes; schema drift; history/time-travel queries; a retention timeline
//   explaining why a former version may become unreadable. Source CDC and table CDF are contrasted
//   without treating either as a permanent archive.
// Bridge: We have a governed transactional destination; next we bring source data into it
//   incrementally and account for imperfect inputs. (Also the last words of the final narration.)
// STATUS: every output is from a LOCAL run (PySpark 4.0.1 + Delta 4.0.0), asserted by
//   scripts/verify/ch03_delta_tables.py. Platform-specific behaviour is documented, not run.
export const deltaTables: Course = {
  id: 'delta-tables',
  title: 'Delta Tables and Reliable Data Changes',
  sections: [
    filesLogsSnapshots,
    acidConcurrentWrites,
    schemaEnforcementEvolution,
    dmlAndMerge,
    historyTimeTravelRestore,
    retentionAndVacuum,
    changeDataFeed,
    tableFeaturesCompatibility,
  ],
}
