import type { Scene } from '@graphlearning/flow'

// §6.7 — a source CDC feed that arrives out of order, applied two ways. LOCAL RUN. Arrival batch 3 holds a
// LATE update (o1 seq 2) and a repeat of o3's insert. Applied in arrival order with hard deletes, o1 ends
// up PENDING and the deleted o3 comes back; applied with a sequence guard and delete markers, both are right.
export const cdcFeed: Scene = {
  id: 'cdc-feed',
  title: 'A CDC feed, applied naively and by sequence',
  flow: 'TB',
  nodes: [
    {
      id: 'cdc-records',
      kind: 'table',
      label: 'The feed, in arrival order',
      sub: 'seq is the source order',
      headers: ['Batch', 'order', 'op', 'seq', 'status'],
      values: [
        ['1', 'o1', 'I', '1', 'PENDING'],
        ['1', 'o2', 'I', '1', 'PENDING'],
        ['1', 'o3', 'I', '1', 'PENDING'],
        ['2', 'o1', 'U', '3', 'COMPLETED'],
        ['2', 'o2', 'U', '2', 'COMPLETED'],
        ['2', 'o3', 'D', '2', '-'],
        ['3', 'o1', 'U', '2', 'PENDING'],
        ['3', 'o3', 'I', '1', 'PENDING'],
      ],
    },
    {
      id: 'apply-compare',
      label: 'Two ways to apply it',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'naive-result',
          kind: 'table',
          label: 'In arrival order',
          sub: 'no sequence check',
          headers: ['order', 'status'],
          values: [
            ['o1', 'PENDING (wrong)'],
            ['o2', 'COMPLETED'],
            ['o3', 'PENDING (back)'],
          ],
        },
        {
          id: 'sequenced-result',
          kind: 'table',
          label: 'By sequence',
          sub: 'newest seq wins',
          headers: ['order', 'status'],
          values: [
            ['o1', 'COMPLETED'],
            ['o2', 'COMPLETED'],
            ['o3', 'deleted'],
          ],
        },
      ],
    },
  ],
  edges: [{ source: 'cdc-records', target: 'apply-compare' }],
}
