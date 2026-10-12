import type { Scene } from '@graphlearning/flow'

// §9.1 — the same data under five layouts, with the correctness checksum that must not move. LOCAL RUN on
// one million generated orders (scripts/verify/ch09_performance.py). Timings are deliberately absent: they
// vary run to run, so only exact counts are quoted.
export const baselineChecks: Scene = {
  id: 'baseline-checks',
  title: 'Same data, five layouts, one checksum',
  flow: 'TB',
  nodes: [
    {
      id: 'checksum-table',
      kind: 'table',
      label: 'Correctness baseline',
      sub: '1,000,000 generated orders, local run',
      headers: ['Layout', 'Rows', 'sum(amount)'],
      values: [
        ['unclustered', '1,000,000', '50,497,436.00'],
        ['Z-ordered', '1,000,000', '50,497,436.00'],
        ['liquid clustered', '1,000,000', '50,497,436.00'],
        ['by order_date', '1,000,000', '50,497,436.00'],
        ['by customer_id', '1,000,000', '50,497,436.00'],
      ],
    },
    {
      id: 'measurement-limits',
      kind: 'list',
      label: 'Measurement limits',
      items: [
        'compare results before speed',
        'timings vary run to run: use counts',
        'change one thing at a time',
        'same data, same query, same compute',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'checksum-table', target: 'measurement-limits' }],
}
