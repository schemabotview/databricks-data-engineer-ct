import type { Scene } from '@graphlearning/flow'

// §6.1 — rows read when a result is recomputed after every file versus processed incrementally. LOCAL
// RUN over the four streaming files (3, 3, 2 and 2 rows). 27 = 3 + 6 + 8 + 10; 10 = 3 + 3 + 2 + 2.
export const recomputeVsIncremental: Scene = {
  id: 'recompute-vs-incremental',
  title: 'Recompute everything, or only what is new',
  flow: 'TB',
  nodes: [
    {
      id: 'rows-read-table',
      kind: 'table',
      label: 'Rows read after each new file',
      sub: 'four files: 3, 3, 2 and 2 rows',
      headers: ['After file', 'Recompute', 'Incremental'],
      values: [
        ['1', '3', '3'],
        ['2', '6', '3'],
        ['3', '8', '2'],
        ['4', '10', '2'],
        ['total read', '27', '10'],
      ],
    },
    {
      id: 'incremental-assumptions',
      kind: 'list',
      label: 'Incremental quietly assumes',
      items: [
        'new data arrives as new rows',
        'old rows never change',
        'late rows have a plan',
        'a restart knows where it stopped',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'rows-read-table', target: 'incremental-assumptions' }],
}
