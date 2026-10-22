import type { Scene, SceneNode } from '@graphlearning/flow'
import { ideFrame, type Pane } from '../ide'
import { focusTree } from '../project'
import { ingestFiles } from '../lakehouse'
import { quiet } from '../quiet'

// A Course 6 IDE frame: the project at section `n`, the open file, and a replayed terminal
// (spine/ingest/). The Course 5 lab folder is closed so the ingestion files fit.
export function ingestFrame(id: string, n: number, file: string, pane: Omit<Pane, 'file' | 'terminal'> & { terminal: string }, fresh: string[], side: SceneNode): Scene {
  const tree = focusTree(ingestFiles(n), file, fresh)
  return ideFrame(id, 'retail-lakehouse', tree, { file, ...pane, terminal: quiet(pane.terminal) }, side)
}
