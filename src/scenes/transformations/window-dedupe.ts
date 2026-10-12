import type { Scene } from '@graphlearning/flow'

// §5.5 — keep the latest event per order, with a total order so ties are decided the same way every
// time. LOCAL RUN. The tie is o4: the resent row has the same event time as the original. Without a
// tie-breaker, 12 shuffles of the same tied rows kept different source files.
export const windowDedupe: Scene = {
  id: 'window-dedupe',
  title: 'Latest per order, deterministically',
  flow: 'TB',
  nodes: [
    {
      id: 'dedupe-code',
      kind: 'code',
      filename: 'latest.sql',
      label: `SELECT * FROM (
  SELECT *, row_number() OVER (
    PARTITION BY order_id
    ORDER BY event_ts DESC,
             source_file DESC) AS rn
  FROM checked WHERE reason IS NULL)
WHERE rn = 1;`,
    },
    {
      id: 'rank-table',
      kind: 'table',
      label: 'Ranked rows for o4 and o6',
      sub: 'rn = 1 is kept',
      headers: ['order', 'event_ts', 'file', 'rn'],
      values: [
        ['o4', '09:14', 'c', '1'],
        ['o4', '09:14', 'b', '2'],
        ['o6', '09:41', 'd', '1'],
        ['o6', '09:23', 'b', '2'],
      ],
    },
    {
      id: 'tiebreak-note',
      kind: 'list',
      label: 'Why the second sort key',
      items: [
        'o4 tied on event_ts',
        'no tie-breaker: survivor varied',
        'with it: always file c',
      ],
      framed: true,
    },
  ],
  edges: [
    { source: 'dedupe-code', target: 'rank-table' },
    { source: 'rank-table', target: 'tiebreak-note' },
  ],
}
