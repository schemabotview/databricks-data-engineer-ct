import type { Scene } from '@graphlearning/flow'

// §3.2 — a real write conflict, forced in a local run: writer A scans slowly while writer B commits
// first. Error text is trimmed (the conflicting-commit JSON is omitted); the class and code are exact.
export const writeConflict: Scene = {
  id: 'write-conflict',
  title: 'Two writers, one refused',
  flow: 'TB',
  nodes: [
    {
      id: 'race-timeline',
      kind: 'table',
      label: 'Conflicting writes on o1',
      sub: 'local run, table orders_race',
      headers: ['Step', 'Writer A', 'Writer B'],
      values: [
        ['1', 'reads version 1', '-'],
        ['2', 'still scanning', 'commits version 2'],
        ['3', 'commit refused', '-'],
      ],
    },
    {
      id: 'conflict-error',
      kind: 'code',
      filename: 'writer A  (trimmed)',
      label: `ConcurrentAppendException
[DELTA_CONCURRENT_APPEND]
Files were added to the root of the
table by a concurrent update.
Please try the operation again.

o1 now: amount 41.00, COMPLETED`,
    },
    {
      id: 'guarantee-scope',
      kind: 'list',
      label: 'What the guarantee covers',
      items: [
        'one commit, one table, all or nothing',
        'readers see a whole version',
        'conflicting writer: refused, retry',
        'two plain appends both committed',
      ],
      framed: true,
    },
  ],
  edges: [
    { source: 'race-timeline', target: 'conflict-error' },
    { source: 'conflict-error', target: 'guarantee-scope' },
  ],
}
