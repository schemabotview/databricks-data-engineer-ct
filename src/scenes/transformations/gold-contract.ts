import type { Scene } from '@graphlearning/flow'

// §5.7 — a gold table with its grain, measures and a contract the table enforces. LOCAL RUN: column
// comments and a CHECK constraint on `gold_sales`; the result is the three-store summary (170.00).
export const goldContract: Scene = {
  id: 'gold-contract',
  title: 'A summary table and its contract',
  flow: 'TB',
  nodes: [
    {
      id: 'gold-ddl',
      kind: 'code',
      filename: 'gold_sales.sql',
      label: `CREATE TABLE gold_sales (
  store_id INT COMMENT 'one row per store',
  store_name STRING,
  orders BIGINT COMMENT 'COMPLETED orders',
  sales DECIMAL(18,2) COMMENT 'sum of amount')
USING delta;

ALTER TABLE gold_sales ADD CONSTRAINT
  sales_not_negative CHECK (sales >= 0);`,
    },
    {
      id: 'gold-rows',
      kind: 'table',
      label: 'gold_sales',
      sub: 'total 170.00',
      headers: ['store_id', 'store_name', 'orders', 'sales'],
      values: [
        ['7', 'Leeds', '3', '75.00'],
        ['9', 'York', '1', '15.00'],
        ['12', 'Hull', '1', '80.00'],
      ],
    },
  ],
  edges: [{ source: 'gold-ddl', target: 'gold-rows' }],
}
