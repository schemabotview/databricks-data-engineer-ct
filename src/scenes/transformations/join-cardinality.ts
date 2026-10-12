import type { Scene } from '@graphlearning/flow'

// §5.4 — a duplicated reference row inflates a total. LOCAL RUN: `stores_dup` is the stores table with
// York (store 9) sent twice. Completed silver orders are o1 40.00, o2 25.00, o4 15.00, o5 80.00,
// o6 10.00 (170.00 in total); the duplicate counts o4 twice (+15.00).
export const joinCardinality: Scene = {
  id: 'join-cardinality',
  title: 'A duplicate key inflates the total',
  flow: 'TB',
  nodes: [
    {
      id: 'join-compare',
      kind: 'table',
      label: 'Same orders, two reference tables',
      sub: 'completed orders joined to stores',
      headers: ['Reference', 'Join rows', 'Sales'],
      values: [
        ['stores (clean)', '5', '170.00'],
        ['stores_dup', '6', '185.00'],
      ],
    },
    {
      id: 'dup-reference',
      kind: 'table',
      label: 'stores_dup',
      sub: 'York arrived twice',
      headers: ['store_id', 'name'],
      values: [
        ['7', 'Leeds'],
        ['9', 'York'],
        ['9', 'York'],
        ['12', 'Hull'],
      ],
    },
    {
      id: 'key-guard',
      kind: 'code',
      filename: 'guard.sql',
      label: `SELECT store_id, count(*) AS n
FROM stores_dup
GROUP BY store_id
HAVING count(*) > 1;
-- 9 | 2`,
    },
  ],
  edges: [
    { source: 'join-compare', target: 'dup-reference' },
    { source: 'dup-reference', target: 'key-guard' },
  ],
}
