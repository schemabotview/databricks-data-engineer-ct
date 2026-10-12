import type { Scene } from '@graphlearning/flow'

// §4.4 — progress tracking, shown with Spark's own file stream source (LOCAL RUN, availableNow, one
// checkpoint). Auto Loader tracks discovered files in the same way conceptually, but its internals are
// documented, not run. Run 5 deletes the checkpoint to show what the checkpoint was remembering.
export const fileProgress: Scene = {
  id: 'file-progress',
  title: 'Files in, progress remembered',
  flow: 'TB',
  nodes: [
    {
      id: 'arrival-timeline',
      kind: 'table',
      label: 'Arrival timeline',
      sub: 'local run, one checkpoint',
      headers: ['Run', 'New file', 'Added', 'Bronze'],
      values: [
        ['1', 'a (3 rows)', '3', '3'],
        ['2', 'b (3 rows)', '3', '6'],
        ['3', 'none', '0', '6'],
        ['4', 'c (2 rows)', '2', '8'],
        ['5', 'checkpoint deleted', '8', '16'],
      ],
    },
    {
      id: 'checkpoint-dir',
      kind: 'code',
      filename: '_checkpoint/  (local run)',
      label: `_checkpoint/
  metadata   the query's id
  offsets/   what each batch planned
  commits/   what each batch finished`,
    },
  ],
  edges: [{ source: 'arrival-timeline', target: 'checkpoint-dir' }],
}
