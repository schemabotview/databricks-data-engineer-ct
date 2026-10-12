import type { Scene } from '@graphlearning/flow'

// §8.5 — what recovery does to business data. LOCAL MODEL of the documented rules (a repair re-runs the
// unsuccessful tasks and keeps the successful ones; a full rerun starts all tasks; Jobs does not make tasks
// idempotent), with REAL Delta row counts. Transform failed once in the first three rows; the last two rows
// are a publish that wrote, then timed out, then was retried.
export const repairIdempotency: Scene = {
  id: 'repair-idempotency',
  title: 'Repair, rerun and idempotent writes',
  flow: 'TB',
  nodes: [
    {
      id: 'recovery-counts',
      kind: 'table',
      label: 'Rows after each recovery',
      sub: 'local model, real Delta counts',
      headers: ['Recovery', 'ingest write', 'Rows'],
      values: [
        ['repair run', 'not re-run', 'bronze 8'],
        ['full rerun', 'append', 'bronze 16'],
        ['full rerun', 'merge', 'bronze 8'],
        ['publish retried', 'append', 'published 2'],
        ['publish retried', 'merge', 'published 1'],
      ],
    },
    {
      id: 'recovery-notes',
      kind: 'list',
      label: 'What to take from it',
      items: [
        'repair kept ingest: attempts stayed 1',
        'DISTINCT downstream hid the 16 rows',
        'a retry after a commit repeats it',
        'merge or overwrite makes both safe',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'recovery-counts', target: 'recovery-notes' }],
}
