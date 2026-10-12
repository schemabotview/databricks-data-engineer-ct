import type { Scene } from '@graphlearning/flow'

// §4.5 — what a fixed schema and schema inference each do to a changed file. LOCAL RUN: JSON files
// 1.json (a normal order) and 2.json (amount "12,50", a new field `channel`). Spark parsed "12,50" as
// 1250.00 with no bad-record flag — a silent wrong value. Auto Loader's evolution modes are DOCUMENTED.
export const schemaDrift: Scene = {
  id: 'schema-drift',
  title: 'When the files change shape',
  flow: 'TB',
  nodes: [
    {
      id: 'drift-table',
      kind: 'table',
      label: 'Reading the two JSON files',
      sub: 'local run',
      headers: ['Read with', 'What happened'],
      values: [
        ['fixed schema', 'channel silently missing'],
        ['fixed schema', '"12,50" became 1250.00'],
        ['inferred schema', 'amount: string, channel: string'],
        ['file 1 alone', 'amount: double'],
      ],
    },
    {
      id: 'drift-files',
      kind: 'code',
      filename: '2.json  (the odd file)',
      label: `{"order_id":"o8","store_id":12,
 "amount":"12,50","status":"PENDING",
 "channel":"web"}`,
    },
    {
      id: 'evolution-modes',
      kind: 'list',
      label: 'Auto Loader modes (documented)',
      items: ['add new columns', 'rescue unexpected data', 'fail on new columns', 'ignore changes'],
      framed: true,
    },
  ],
  edges: [
    { source: 'drift-table', target: 'drift-files' },
    { source: 'drift-files', target: 'evolution-modes' },
  ],
}
