import type { Scene, SceneNode } from '@graphlearning/flow'
import { ideFrame, type Pane } from '../ide'
import { focusTree } from '../project'
import { pipelinesFiles } from '../lakehouse'
import { quiet } from '../quiet'

// A Course 9 IDE frame: the project at section `n`, the open file and a replayed terminal (spine/pipelines/).

export function pipelinesFrame(id: string, n: number, file: string, pane: Omit<Pane, 'file' | 'terminal'> & { terminal: string }, fresh: string[], side: SceneNode): Scene {
  const tree = focusTree(pipelinesFiles(n), file, fresh)
  return ideFrame(id, 'retail-lakehouse', tree, { file, ...pane, terminal: quiet(pane.terminal) }, side)
}
