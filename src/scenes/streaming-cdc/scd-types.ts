import type { Scene } from '@graphlearning/flow'

// §6.8 — the same events as SCD type 1 (latest only) and type 2 (every version with its validity).
// LOCAL RUN. seq stands in for time. A delete closes the previous version and is not itself a version, so
// o3 has one closed row and no current row.
export const scdTypes: Scene = {
  id: 'scd-types',
  title: 'Type 1 keeps the latest, type 2 keeps the story',
  flow: 'TB',
  nodes: [
    {
      id: 'scd1-table',
      kind: 'table',
      label: 'SCD type 1',
      sub: 'one current row per order',
      headers: ['order', 'amount', 'status'],
      values: [
        ['o1', '45.00', 'COMPLETED'],
        ['o2', '25.00', 'COMPLETED'],
      ],
    },
    {
      id: 'scd2-table',
      kind: 'table',
      label: 'SCD type 2',
      sub: 'every version, with start and end seq',
      headers: ['order', 'status', 'start', 'end'],
      values: [
        ['o1', 'PENDING', '1', '2'],
        ['o1', 'PENDING', '2', '3'],
        ['o1', 'COMPLETED', '3', 'open'],
        ['o2', 'PENDING', '1', '2'],
        ['o2', 'COMPLETED', '2', 'open'],
        ['o3', 'PENDING', '1', '2 (deleted)'],
      ],
    },
  ],
  edges: [{ source: 'scd1-table', target: 'scd2-table' }],
}
