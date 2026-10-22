import type { Scene } from '@graphlearning/flow'
import { whyDatabricksScenes } from './why-databricks'
import { howDatabricksRunsScenes } from './how-databricks-runs'
import { startScenes } from './start'
import { governScenes } from './govern'
import { tablesScenes } from './tables'
import { ingestScenes } from './ingest'
import { transformScenes } from './transform'

// Scene registry. Sections reference scenes by id; scenes are grouped by course (one folder each,
// mirroring src/content). Ids are globally unique across courses, so the flat lookup below is
// unambiguous. Courses are added here as each is authored.
const ALL: Scene[] = [...whyDatabricksScenes, ...howDatabricksRunsScenes, ...startScenes, ...governScenes, ...tablesScenes, ...ingestScenes, ...transformScenes]

export const SCENES: Record<string, Scene> = Object.fromEntries(ALL.map((s) => [s.id, s]))

export function getScene(id: string): Scene | undefined {
  return SCENES[id]
}
