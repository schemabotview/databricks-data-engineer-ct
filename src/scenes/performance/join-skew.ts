import type { Scene } from '@graphlearning/flow'

// §9.4 — two join plans for the same answer, and a skewed key. LOCAL RUN (adaptive execution off so plans
// are fixed): the default plan broadcasts the 50-row stores table; with broadcasting disabled the same query
// sort-merge joins with three shuffles. Rows per partition after repartitioning 1,000,000 orders into 4.
export const joinSkew: Scene = {
  id: 'join-skew',
  title: 'Join plans and a skewed key',
  flow: 'TB',
  nodes: [
    {
      id: 'join-plans',
      kind: 'table',
      label: 'Same query, same answer, two plans',
      sub: 'orders joined to 50 stores, then grouped',
      headers: ['Plan', 'Join', 'Shuffles'],
      values: [
        ['default', 'BroadcastHashJoin', '1 (the GROUP BY)'],
        ['broadcast off', 'SortMergeJoin', '3'],
      ],
    },
    {
      id: 'skew-table',
      kind: 'table',
      label: 'Largest of 4 partitions',
      sub: 'store 7 holds 80% of the rows',
      headers: ['Data', 'Largest partition'],
      values: [
        ['evenly spread', '319,925'],
        ['skewed on store 7', '855,480'],
        ['skewed, salted 64 ways', '299,626'],
      ],
    },
  ],
  edges: [{ source: 'join-plans', target: 'skew-table' }],
}
