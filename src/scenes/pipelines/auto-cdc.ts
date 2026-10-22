import type { Scene } from '@graphlearning/flow'

// AUTO CDC, DOCUMENTED (CREATE FLOW … AS AUTO CDC INTO … KEYS … APPLY AS DELETE WHEN … SEQUENCE BY …
// STORED AS SCD TYPE 2; older name APPLY CHANGES INTO; SCD 2 adds __START_AT / __END_AT — via search
// summaries of the docs). The result table is ILLUSTRATIVE: Course 8 §8's real SCD 2 versions, shown in
// the documented column names.
const SQL = [
  '-- documented, not run: AUTO CDC is a pipeline feature',
  'CREATE OR REFRESH STREAMING TABLE orders_history;',
  '',
  'CREATE FLOW orders_cdc AS AUTO CDC INTO orders_history',
  'FROM STREAM(order_changes)',
  'KEYS (order_id)',
  "APPLY AS DELETE WHEN op = 'D'",
  'SEQUENCE BY seq',
  'COLUMNS * EXCEPT (op, seq)',
  'STORED AS SCD TYPE 2;',
].join('\n')

export const autoCdc: Scene = {
  id: 'auto-cdc',
  framed: true,
  padding: 0.03,
  flow: 'LR',
  align: 'start',
  nodes: [
    {
      id: 'cdc-left',
      label: 'cdc-left',
      bare: true,
      children: [
        { id: 'cdc-sql', kind: 'code', filename: 'AUTO CDC — documented, not run', label: SQL, highlight: [4, 6, 7, 8, 10] },
        {
          id: 'clauses',
          kind: 'table',
          label: 'Each clause, and the code it replaces (src/retail/cdc.py)',
          headers: ['clause', 'cdc.py did it with'],
          values: [
            ['KEYS (order_id)', 'MERGE … ON t.order_id = s.order_id'],
            ['SEQUENCE BY seq', 'WHEN MATCHED AND s.seq > t.seq'],
            ['APPLY AS DELETE WHEN', 'is_deleted = (s.op = \'D\')'],
            ['(per batch)', 'row_number() … newest first'],
            ['SCD TYPE 2', 'Course 8 §8’s valid_from / valid_to'],
          ],
        },
      ],
    },
    {
      id: 'cdc-right',
      label: 'cdc-right',
      bare: true,
      children: [
        {
          id: 'history-result',
          kind: 'table',
          label: 'orders_history, illustrative (Course 8’s versions)',
          headers: ['order_id', 'amount', 'status', '__START_AT', '__END_AT'],
          values: [
            ['o1', '40.00', 'PENDING', '1', '2'],
            ['o1', '45.00', 'PENDING', '2', '3'],
            ['o1', '45.00', 'COMPLETED', '3', 'NULL'],
            ['o2', '25.00', 'PENDING', '1', '2'],
            ['o2', '25.00', 'COMPLETED', '2', 'NULL'],
            ['o3', '60.00', 'PENDING', '1', '2'],
          ],
        },
        {
          id: 'cdc-facts',
          kind: 'list',
          icon: 'key',
          label: 'Declared, still your decisions',
          pattern: 'service',
          items: [
            'The key and the sequence are still yours to choose',
            'A tie in the sequence still needs a tie-breaker',
            'Type 1 or type 2 is chosen before the history is lost',
            'The source CDC still has to reach bronze first',
          ],
        },
      ],
    },
  ],
  edges: [],
}
