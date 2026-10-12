import type { Scene } from '@graphlearning/flow'

// §3.5 — the three things people confuse: reading an old version, listing history, and restoring.
// LOCAL RUN. RESTORE to version 4 undoes the MERGE by writing a NEW version 6; version 5 stays
// readable by time travel.
export const historyRestore: Scene = {
  id: 'history-restore',
  title: 'History, time travel and restore',
  flow: 'TB',
  nodes: [
    {
      id: 'history-code',
      kind: 'code',
      filename: 'history.sql',
      label: `SELECT * FROM orders VERSION AS OF 2;

DESCRIBE HISTORY orders;

RESTORE TABLE orders TO VERSION AS OF 4;`,
    },
    {
      id: 'restore-history',
      kind: 'table',
      label: 'History after the restore',
      sub: 'version 5 is still readable',
      headers: ['Ver', 'Operation', 'Rows'],
      values: [
        ['4', 'DELETE o3', '6'],
        ['5', 'MERGE', '7'],
        ['6', 'RESTORE to v4', '6'],
      ],
    },
    {
      id: 'distinctions',
      kind: 'table',
      label: 'Three commands',
      sub: 'which ones write',
      headers: ['Command', 'Writes?', 'Effect'],
      values: [
        ['VERSION AS OF', 'no', 'reads old data'],
        ['DESCRIBE HISTORY', 'no', 'lists commits'],
        ['RESTORE', 'yes', 'adds a version'],
      ],
    },
  ],
  edges: [
    { source: 'history-code', target: 'restore-history' },
    { source: 'restore-history', target: 'distinctions' },
  ],
}
