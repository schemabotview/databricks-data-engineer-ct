import type { Scene, SceneNode } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { projectTree } from '../project'
import { DELTA_LABS, tablesFiles } from '../lakehouse'
import { quiet } from '../quiet'

// Every Course 5 frame is one lab script of tools/delta/, run for real on lab.* tables (spine/tables/),
// beside a side pane. The explorer keeps the course's other folders closed so the lab folder fits.
export function labFrame(id: string, n: number, code: string, raw: string, view: { show?: [number, number][]; highlight: number[] }, side: SceneNode, collapse = ['conf', 'data', 'governance', 'notebooks', 'src']): Scene {
  const file = `tools/delta/${DELTA_LABS[n - 1]}.py`
  return ideFrame(id, 'retail-lakehouse', projectTree(tablesFiles(n), file, [file], collapse), { file, code, ...view, terminal: quiet(raw) }, side)
}
