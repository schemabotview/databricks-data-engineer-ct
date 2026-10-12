import type { Scene } from '@graphlearning/flow'

// §6.10 — the sequence-guarded apply and what it survives. LOCAL RUN: applying all three batches twice
// leaves the same table; applying them in reverse order leaves the same table; reading the table's change
// feed from version 1 after VACUUM RETAIN 0 HOURS fails (the files are gone).
export const recoveryGuards: Scene = {
  id: 'recovery-guards',
  title: 'Surviving duplicates, disorder and lost history',
  flow: 'TB',
  nodes: [
    {
      id: 'guard-code',
      kind: 'code',
      filename: 'apply.sql',
      label: `MERGE INTO sequenced t USING b s
ON t.order_id = s.order_id
WHEN MATCHED AND s.seq > t.seq THEN UPDATE SET
  amount = s.amount, status = s.status,
  seq = s.seq, is_deleted = (s.op = 'D')
WHEN NOT MATCHED THEN INSERT ...;`,
    },
    {
      id: 'recovery-table',
      kind: 'table',
      label: 'Tested problems and the guard',
      sub: 'local run',
      headers: ['Problem', 'Guard', 'Result'],
      values: [
        ['batch replayed', 'seq > t.seq', 'same table'],
        ['arrives out of order', 'seq > t.seq', 'same table'],
        ['late insert after delete', 'delete marker', 'stays deleted'],
        ['old feed after VACUUM', 'none', 'unreadable'],
      ],
    },
  ],
  edges: [{ source: 'guard-code', target: 'recovery-table' }],
}
