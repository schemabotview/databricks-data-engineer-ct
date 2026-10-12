import type { Scene } from '@graphlearning/flow'

// §7.7 — kinds of update and the consequence of a full refresh. DOCUMENTED, NOT RUN. The row counts are
// ARITHMETIC from Chapter 4's local file counts (a, b and c hold 3, 3 and 2 rows), not a pipeline run:
// if file c had expired from the source, a full refresh could rebuild only a and b.
export const refreshModes: Scene = {
  id: 'refresh-modes',
  title: 'Update, selective refresh, full refresh',
  flow: 'TB',
  nodes: [
    {
      id: 'refresh-table',
      kind: 'table',
      label: 'Kinds of update',
      sub: 'documented, not run',
      headers: ['Refresh', 'Does', 'Watch for'],
      values: [
        ['Update', 'processes new data', 'nothing new: no work'],
        ['Selected tables', 'only the ones named', 'stale dependents'],
        ['Full refresh', 'clears and rebuilds', 'data the source lost'],
      ],
    },
    {
      id: 'full-refresh-math',
      kind: 'table',
      label: 'If file c had expired at the source',
      sub: 'arithmetic from the Chapter 4 counts',
      headers: ['Case', 'Rows rebuilt'],
      values: [
        ['all three files kept', '8'],
        ['file c expired', '6'],
      ],
    },
    {
      id: 'reset-guard',
      kind: 'list',
      label: 'Protect what cannot be rebuilt',
      items: ['pipelines.reset.allowed = false', 'blocks a full refresh of a table', 'keep source retention in mind'],
      framed: true,
    },
  ],
  edges: [
    { source: 'refresh-table', target: 'full-refresh-math' },
    { source: 'full-refresh-math', target: 'reset-guard' },
  ],
}
