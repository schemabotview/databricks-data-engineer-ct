import type { Scene, SceneNode } from '@graphlearning/flow'
import { ideFrame, type Pane } from '../ide'
import { focusTree } from '../project'
import { transformFiles } from '../lakehouse'
import { quiet } from '../quiet'

// A Course 7 IDE frame: the project at section `n` over a bronze table of 11 events (files a–d landed
// and ingested by the step's setup), the open file, and a replayed terminal (spine/transform/).
export function transformFrame(id: string, n: number, file: string, pane: Omit<Pane, 'file' | 'terminal'> & { terminal: string }, fresh: string[], side: SceneNode): Scene {
  const tree = focusTree(transformFiles(n), file, fresh)
  return ideFrame(id, 'retail-lakehouse', tree, { file, ...pane, terminal: quiet(pane.terminal) }, side)
}
