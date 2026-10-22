import type { Scene, SceneNode } from '@graphlearning/flow'
import { ideFrame, type Pane } from '../ide'
import { focusTree } from '../project'
import { fastFiles } from '../lakehouse'
import { quiet } from '../quiet'

// A Course 11 IDE frame: the project at section `n`, the open file and a replayed terminal (spine/fast/).

export function fastFrame(id: string, n: number, file: string, pane: Omit<Pane, 'file' | 'terminal'> & { terminal: string }, fresh: string[], side: SceneNode): Scene {
  const tree = focusTree(fastFiles(n), file, fresh)
  return ideFrame(id, 'retail-lakehouse', tree, { file, ...pane, terminal: quiet(pane.terminal) }, side)
}
