import type { Scene } from '@graphlearning/flow'

// §3.4 — the four DML statements with their measured effect, and the MERGE that touches two rows
// differently. LOCAL RUN. The match rule (two source rows for one target row is an error) is
// asserted in scripts/verify/ch03_delta_tables.py.
export const dmlSemantics: Scene = {
  id: 'dml-semantics',
  title: 'INSERT, UPDATE, DELETE and MERGE',
  flow: 'TB',
  cols: 2,
  nodes: [
    {
      id: 'merge-side',
      label: 'The MERGE at version 5',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'merge-code',
          kind: 'code',
          filename: 'merge.sql',
          label: `MERGE INTO orders t
USING updates s
ON t.order_id = s.order_id
WHEN MATCHED THEN
  UPDATE SET status = s.status
WHEN NOT MATCHED THEN
  INSERT *;`,
        },
        {
          id: 'updates-source',
          kind: 'table',
          label: 'The source: updates',
          sub: 'two rows',
          headers: ['order', 'store', 'amount', 'status'],
          values: [
            ['o8', '12', '20.00', 'COMPLETED'],
            ['o9', '9', '45.00', 'COMPLETED'],
          ],
        },
        {
          id: 'merge-effect',
          kind: 'table',
          label: 'Before and after',
          sub: 'updates holds o8 and o9',
          headers: ['Order', 'Before', 'After'],
          values: [
            ['o8', 'PENDING', 'COMPLETED'],
            ['o9', 'absent', '9, 45.00, COMPLETED'],
          ],
        },
      ],
    },
    {
      id: 'dml-side',
      label: 'Measured effect',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'dml-table',
          kind: 'table',
          label: 'Versions 2 to 5',
          sub: 'from DESCRIBE HISTORY',
          headers: ['Ver', 'Statement', 'Rows'],
          values: [
            ['2', 'INSERT o8', '1 added'],
            ['3', 'UPDATE o6', '1 updated'],
            ['4', 'DELETE o3', '1 deleted'],
            ['5', 'MERGE', '1 + 1'],
          ],
        },
        {
          id: 'match-rules',
          kind: 'list',
          label: 'Match semantics',
          items: ['ON decides what matches', 'matched: update; else insert', 'two sources for one target: error'],
          framed: true,
        },
      ],
    },
  ],
  edges: [],
}
