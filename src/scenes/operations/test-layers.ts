import type { Scene } from '@graphlearning/flow'

// §10.3 — the example project's seven tests by layer (REAL pytest run, 7 passed), and the readable diff a
// deliberately buggy variant of one function produces (REAL output of that run; the bug sorts ascending, so
// the OLDEST event for o6 wins).
export const testLayers: Scene = {
  id: 'test-layers',
  title: 'Three layers of tests, and one failing diff',
  flow: 'TB',
  nodes: [
    {
      id: 'test-table',
      kind: 'table',
      label: 'The project\'s tests',
      sub: 'pytest, local PySpark: 7 passed',
      headers: ['Layer', 'Tests', 'Checks'],
      values: [
        ['unit', '4', 'one function, exact rows'],
        ['integration', '1', 'the whole flow, per layer'],
        ['data quality', '2', 'properties of the output'],
      ],
    },
    {
      id: 'diff-card',
      kind: 'code',
      filename: 'expected vs actual  (buggy variant)',
      label: `rows differ:
  missing    ('o6', 'COMPLETED', 'orders-d.csv')
  unexpected ('o6', 'PENDING', 'orders-b.csv')`,
    },
    {
      id: 'which-layer',
      kind: 'list',
      label: 'Which layer catches what',
      items: ['unit: a function changed', 'integration: the wiring changed', 'quality: the data changed'],
      framed: true,
    },
  ],
  edges: [
    { source: 'test-table', target: 'diff-card' },
    { source: 'diff-card', target: 'which-layer' },
  ],
}
