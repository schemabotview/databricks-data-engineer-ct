import type { Scene } from '@graphlearning/flow'

// The eight-order sample through bronze, silver and gold. Every row and sum is a LOCAL run of
// PySpark 4.0.1 + Delta Lake 4.0.0 (scripts/verify/ch01_foundations.py): silver = DISTINCT rows whose
// amount casts to DECIMAL(10,2); gold = COMPLETED silver rows per store.
export const medallion: Scene = {
  id: 'bronze-silver-gold',
  framed: true,
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'flow',
      label: 'The same eight orders, three layers (local run: PySpark 4.0.1 + Delta 4.0.0)',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'bronze',
          kind: 'table',
          label: 'bronze_orders — what arrived',
          sub: '8 rows, every column text',
          headers: ['order_id', 'store_id', 'amount', 'status'],
          values: [
            ['o1', '7', '40.00', 'COMPLETED'],
            ['o2', '7', '25.00', 'COMPLETED'],
            ['o3', '9', '60.00', 'CANCELLED'],
            ['o4', '9', '15.00', 'COMPLETED'],
            ['o5', '12', '80.00', 'COMPLETED'],
            ['o6', '7', '10.00', 'PENDING'],
            ['o4', '9', '15.00', 'COMPLETED'],
            ['o7', '9', 'n/a', 'COMPLETED'],
          ],
        },
        {
          id: 'silver',
          kind: 'table',
          label: 'silver_orders — trustworthy',
          sub: '6 rows: cast to types, o4 merged, o7 rejected',
          headers: ['order_id', 'store_id', 'amount', 'status'],
          values: [
            ['o1', '7', '40.00', 'COMPLETED'],
            ['o2', '7', '25.00', 'COMPLETED'],
            ['o3', '9', '60.00', 'CANCELLED'],
            ['o4', '9', '15.00', 'COMPLETED'],
            ['o5', '12', '80.00', 'COMPLETED'],
            ['o6', '7', '10.00', 'PENDING'],
          ],
        },
        {
          id: 'gold',
          kind: 'table',
          label: 'gold_sales — one question',
          sub: 'COMPLETED orders only, summed per store',
          headers: ['store_id', 'orders', 'sales'],
          values: [
            ['7', '2', '65.00'],
            ['9', '1', '15.00'],
            ['12', '1', '80.00'],
            ['total', '4', '160.00'],
          ],
        },
      ],
      edges: [
        { source: 'bronze', target: 'silver' },
        { source: 'silver', target: 'gold' },
      ],
    },
    {
      id: 'below',
      label: 'Account for every row',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'reconcile',
          kind: 'table',
          label: 'Reconciliation: 8 = 6 + 1 + 1',
          headers: ['rows', 'where they went'],
          values: [
            ['6', 'into silver'],
            ['1', 'o4 resent, identical — merged'],
            ['1', 'o7, amount “n/a” — rejected'],
          ],
        },
        {
          id: 'promises',
          kind: 'table',
          label: 'A layer’s name promises nothing — the guarantee comes from',
          headers: ['guarantee', 'comes from', 'course'],
          values: [
            ['a write lands whole', 'the Delta log', '5'],
            ['only finance reads gold', 'Unity Catalog grants', '4'],
            ['o7 is set aside and counted', 'the job’s quality rules', '7'],
            ['gold is fresh by 06:00', 'the schedule and its alerts', '10, 12'],
          ],
        },
      ],
    },
  ],
  edges: [],
}
