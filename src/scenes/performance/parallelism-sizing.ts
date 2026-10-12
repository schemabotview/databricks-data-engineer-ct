import type { Scene } from '@graphlearning/flow'

// §9.3 — parallelism should match the data. LOCAL RUN: aggregating 1,000 rows with 200 shuffle partitions
// creates 200 reduce tasks; 4 partitions creates 4; adaptive execution coalesced the 200 into 1. Serverless
// sizing, Photon and feature eligibility are DOCUMENTED, NOT RUN, and stated generically.
export const parallelismSizing: Scene = {
  id: 'parallelism-sizing',
  title: 'Tasks should fit the data',
  flow: 'TB',
  nodes: [
    {
      id: 'tasks-table',
      kind: 'table',
      label: 'Reduce tasks to aggregate 1,000 rows',
      sub: 'local run',
      headers: ['Setting', 'Tasks'],
      values: [
        ['200 shuffle partitions', '200'],
        ['4 shuffle partitions', '4'],
        ['200, adaptive execution on', '1'],
      ],
    },
    {
      id: 'eligibility-list',
      kind: 'list',
      label: 'Ask before relying on a feature',
      items: [
        'Photon: which operators, which compute?',
        'serverless: is it available here?',
        'does the runtime support the feature?',
        'measure before and after',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'tasks-table', target: 'eligibility-list' }],
}
