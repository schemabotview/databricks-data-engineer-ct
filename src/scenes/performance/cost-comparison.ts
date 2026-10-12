import type { Scene } from '@graphlearning/flow'

// §9.8 — a HYPOTHETICAL cost comparison. Every input is an ASSUMPTION, none is a price or a measurement:
// 3 seconds to open a file, 2 machines, 1 cost unit per machine-hour, 24 runs a day. The files-read column
// IS measured (Chapter 9 local run). Scan time proportional to files opened is a gross simplification.
export const costComparison: Scene = {
  id: 'cost-comparison',
  title: 'Cost units per day, under stated assumptions',
  flow: 'TB',
  nodes: [
    {
      id: 'assumptions-table',
      kind: 'table',
      label: 'Assumptions (not measurements)',
      sub: 'no prices are quoted',
      headers: ['Input', 'Assumed value'],
      values: [
        ['time to open one file', '3 seconds'],
        ['machines', '2'],
        ['rate', '1 unit per machine-hour'],
        ['runs per day', '24'],
      ],
    },
    {
      id: 'cost-table',
      kind: 'table',
      label: 'Hypothetical cost of one store filter',
      sub: 'files read are measured',
      headers: ['Layout', 'Files read', 'Units/day'],
      values: [
        ['unclustered', '24', '0.96'],
        ['compaction only', '2', '0.08'],
        ['clustered by store', '1', '0.04'],
        ['partitioned by date', '720', '28.80'],
      ],
    },
  ],
  edges: [{ source: 'assumptions-table', target: 'cost-table' }],
}
