import type { Scene, SceneNode } from '@graphlearning/flow'
import { ideFrame, type Pane } from '../ide'
import { focusTree } from '../project'
import { scheduleFiles } from '../lakehouse'
import { quiet } from '../quiet'

// A Course 10 IDE frame: the project at section `n`, the open file and a replayed terminal (spine/schedule/).

export function scheduleFrame(id: string, n: number, file: string, pane: Omit<Pane, 'file' | 'terminal'> & { terminal: string }, fresh: string[], side: SceneNode): Scene {
  const tree = focusTree(scheduleFiles(n), file, fresh)
  return ideFrame(id, 'retail-lakehouse', tree, { file, ...pane, terminal: quiet(pane.terminal) }, side)
}
