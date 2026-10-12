import type { Scene } from '@graphlearning/flow'

// §10.8 — a deletion obligation, run locally (scripts/verify/ch10_operations.py): DELETE customer c1's rows,
// then check every place the deleted data still lives. Old versions and the change feed hold it until VACUUM;
// a derived table holds it until it is recomputed (100.00 stale, 35.00 after).
export const deletionRecovery: Scene = {
  id: 'deletion-recovery',
  title: 'Deleting a customer\'s rows, and what remains',
  flow: 'TB',
  nodes: [
    {
      id: 'remains-table',
      kind: 'table',
      label: 'Does customer c1\'s data still exist?',
      sub: 'local run, after DELETE',
      headers: ['Where', 'After DELETE', 'After VACUUM'],
      values: [
        ['the table, now', 'no', 'no'],
        ['an older version', 'yes', 'no'],
        ['the change feed', 'yes', 'no'],
        ['a derived table', 'yes: 100.00', 'yes: 100.00'],
      ],
    },
    {
      id: 'obligation-list',
      kind: 'list',
      label: 'A deletion checklist',
      items: [
        'delete at the source of truth',
        'VACUUM after retention allows it',
        'recompute every derived table',
        'check change feeds and copies',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'remains-table', target: 'obligation-list' }],
}
