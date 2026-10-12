import type { Scene } from '@graphlearning/flow'

// §3.3 — schema enforcement, a CHECK constraint, and evolution through mergeSchema. LOCAL RUN on
// `orders_c`; every outcome is the engine's own refusal or success. NOT NULL is declared at CREATE
// because the local Delta refused to add it to an existing column.
export const schemaContract: Scene = {
  id: 'schema-contract',
  title: 'Enforcement, a contract, and evolution',
  flow: 'TB',
  nodes: [
    {
      id: 'contract-ddl',
      kind: 'code',
      filename: 'contract.sql',
      label: `CREATE TABLE orders_c (
  order_id STRING NOT NULL,
  store_id INT,
  amount DECIMAL(10,2),
  status STRING) USING delta;

ALTER TABLE orders_c ADD CONSTRAINT
  positive_amount CHECK (amount > 0);`,
    },
    {
      id: 'attempts-table',
      kind: 'table',
      label: 'Five writes, five outcomes',
      sub: 'local run',
      headers: ['Write', 'Outcome'],
      values: [
        ['extra column', 'refused: schema mismatch'],
        ["'abc' into INT", 'refused: CAST_INVALID_INPUT'],
        ['NULL order_id', 'refused: NOT NULL'],
        ['amount -5.00', 'refused: CHECK'],
        ['mergeSchema append', 'accepted: adds channel'],
      ],
    },
  ],
  edges: [{ source: 'contract-ddl', target: 'attempts-table' }],
}
