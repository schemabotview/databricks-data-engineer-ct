import { whyDatabricks } from './why-databricks'
import { howDatabricksRuns } from './how-databricks-runs'
import { start } from './start'
import { govern } from './govern'
import { tables } from './tables'
import { ingest } from './ingest'
import { transform } from './transform'
import { changes } from './changes'
import { pipelines } from './pipelines'
import { schedule } from './schedule'
import { fast } from './fast'
import { operate } from './operate'
import { defend } from './defend'
import type { Course, Section } from './types'

// Course registry, in syllabus order, one entry per course of docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md. A
// course is registered here only once it is authored.
export const COURSES: Record<string, Course> = {
  [whyDatabricks.id]: whyDatabricks,
  [howDatabricksRuns.id]: howDatabricksRuns,
  [start.id]: start,
  [govern.id]: govern,
  [tables.id]: tables,
  [ingest.id]: ingest,
  [transform.id]: transform,
  [changes.id]: changes,
  [pipelines.id]: pipelines,
  [schedule.id]: schedule,
  [fast.id]: fast,
  [operate.id]: operate,
  [defend.id]: defend,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract every recorder drives, so it cannot be a per-repo decision. Re-exported here
// because this module is what the app and the scripts import them from.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
