import type { Scene } from '@graphlearning/flow'

// §8.7 — the whole job, task by task, and its run history. The task design is DOCUMENTED; the history is
// from the LOCAL MODEL with real counts: run 1 had transform fail, a repair run completed it, and the
// published table held one row of 160.00. Idempotency choices are the ones the model tested.
export const orchestrationWalkthrough: Scene = {
  id: 'orchestration-walkthrough',
  title: 'Ingest, transform, validate, publish',
  flow: 'TB',
  nodes: [
    {
      id: 'task-design-table',
      kind: 'table',
      label: 'The job, task by task',
      sub: 'design; documented, not run',
      headers: ['Task', 'Depends on', 'Safe to repeat by'],
      values: [
        ['ingest', 'nothing', 'MERGE on file + order'],
        ['transform', 'ingest', 'overwrite silver'],
        ['validate', 'transform', 'read-only'],
        ['publish', 'validate, rows_ok', 'MERGE on run_date'],
      ],
    },
    {
      id: 'run-history-table',
      kind: 'table',
      label: 'The run history',
      sub: 'local model, real counts',
      headers: ['Run', 'What happened', 'Published'],
      values: [
        ['1', 'transform failed once', 'none'],
        ['repair', 'transform, validate, publish', '1 row, 160.00'],
      ],
    },
  ],
  edges: [{ source: 'task-design-table', target: 'run-history-table' }],
}
