import { foundations } from './foundations'
import { governance } from './governance'
import { deltaTables } from './delta-tables'
import { ingestion } from './ingestion'
import { transformations } from './transformations'
import type { Course, Section } from './types'

// Course registry, in syllabus order. A course is registered here only once it is authored.
export const COURSES: Record<string, Course> = {
  [foundations.id]: foundations,
  [governance.id]: governance,
  [deltaTables.id]: deltaTables,
  [ingestion.id]: ingestion,
  [transformations.id]: transformations,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract every recorder drives, so it cannot be a per-repo decision. Re-exported here
// because this module is what the app and the scripts import them from.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
