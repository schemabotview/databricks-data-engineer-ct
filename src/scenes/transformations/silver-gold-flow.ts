import type { Scene } from '@graphlearning/flow'

// §5.8 — the whole flow with its reconciliation. LOCAL RUN. Detail-to-summary: the silver COMPLETED
// orders (5 rows, 170.00) equal the gold totals (5 orders, 170.00). Chapter 1's gold total was 160.00
// because o6 was still PENDING; a later event completed it (+10.00).
export const silverGoldFlow: Scene = {
  id: 'silver-gold-flow',
  title: 'Bronze to silver to gold, reconciled',
  flow: 'TB',
  nodes: [
    {
      id: 'flow-chain',
      label: 'The flow',
      pattern: 'group',
      flow: 'LR',
      children: [
        { id: 'flow-bronze', label: 'bronze_events', sub: '11 text rows', pattern: 'storage', icon: 'database' },
        { id: 'flow-silver', label: 'silver_orders', sub: '6 typed orders', pattern: 'storage', icon: 'funnel' },
        { id: 'flow-gold', label: 'gold_sales', sub: '3 rows, 170.00', pattern: 'storage', icon: 'sigma' },
      ],
      edges: [
        { source: 'flow-bronze', target: 'flow-silver' },
        { source: 'flow-silver', target: 'flow-gold' },
      ],
    },
    {
      id: 'flow-evidence',
      label: 'Build and check',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'silver-build',
          kind: 'code',
          filename: 'silver_orders.sql',
          label: `CREATE TABLE silver_orders USING delta AS
SELECT order_id, store_id, amount, status,
       event_ts, source_file
FROM (SELECT *, row_number() OVER (
        PARTITION BY order_id
        ORDER BY event_ts DESC,
                 source_file DESC) AS rn
      FROM checked WHERE reason IS NULL)
WHERE rn = 1;`,
        },
        {
          id: 'detail-summary',
          kind: 'table',
          label: 'Detail equals summary',
          sub: 'COMPLETED orders',
          headers: ['Layer', 'Orders', 'Sales'],
          values: [
            ['silver detail', '5', '170.00'],
            ['gold summary', '5', '170.00'],
          ],
        },
      ],
    },
  ],
  edges: [{ source: 'flow-chain', target: 'flow-evidence' }],
}
