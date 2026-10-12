import type { Scene } from '@graphlearning/flow'

// §1.6 — the same eight rows through bronze, silver and gold, with the reconciliation that explains
// every difference. All counts and sums come from a LOCAL run (PySpark 4.0.1 + Delta Lake 4.0.0):
// silver = DISTINCT rows whose amount casts to DECIMAL(10,2); gold = COMPLETED silver rows per store.
export const layeredProducts: Scene = {
  id: 'layered-products',
  title: 'Bronze, silver and gold on the same orders',
  flow: 'LR',
  nodes: [
    {
      id: 'layers',
      label: 'Layers',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'bronze-layer', label: 'bronze_orders', sub: '8 raw rows, all text', pattern: 'storage', icon: 'database' },
        { id: 'silver-layer', label: 'silver_orders', sub: '6 typed, unique rows', pattern: 'storage', icon: 'funnel' },
        { id: 'gold-layer', label: 'gold_sales', sub: '3 rows, total 160.00', pattern: 'storage', icon: 'sigma' },
      ],
      edges: [
        { source: 'bronze-layer', target: 'silver-layer' },
        { source: 'silver-layer', target: 'gold-layer' },
      ],
    },
    {
      id: 'layer-evidence',
      label: 'Evidence and limits',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'silver-sql',
          kind: 'code',
          filename: 'silver_orders.sql',
          label: `CREATE TABLE silver_orders USING delta AS
SELECT DISTINCT order_id,
  CAST(store_id AS INT) AS store_id,
  CAST(amount AS DECIMAL(10,2)) AS amount,
  status
FROM bronze_orders
WHERE try_cast(amount AS DECIMAL(10,2))
      IS NOT NULL`,
        },
        {
          id: 'reconciliation',
          kind: 'table',
          label: 'Reconciliation',
          sub: '8 = 6 + 1 + 1',
          headers: ['Rows', 'Why'],
          values: [
            ['6', 'in silver'],
            ['1', 'o4 resent'],
            ['1', 'o7 amount n/a'],
          ],
        },
        {
          id: 'names-promise',
          kind: 'list',
          label: 'A layer name does not promise',
          items: ['atomic writes', 'who may read', 'that the rules are right'],
          framed: true,
        },
      ],
    },
  ],
  edges: [{ source: 'layers', target: 'layer-evidence' }],
}
