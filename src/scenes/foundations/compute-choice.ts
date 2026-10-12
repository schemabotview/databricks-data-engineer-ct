import type { Scene } from '@graphlearning/flow'

// §1.4 — the three compute families as a comparison table, then the provisional choices the retail
// flow makes. Deliberately no prices and no sizes: cost is compared on a measured workload in
// Chapter 9, and which options a workspace has depends on its region and settings.
export const computeChoice: Scene = {
  id: 'compute-choice',
  title: 'Three families of compute',
  flow: 'TB',
  nodes: [
    {
      id: 'compute-table',
      kind: 'table',
      label: 'Compute families',
      sub: 'what is managed, and for what',
      headers: ['Option', 'Runs', 'You manage', 'Fits'],
      values: [
        ['Serverless', 'notebooks, jobs', 'almost nothing', 'bursty work'],
        ['Classic', 'Spark in your account', 'size, runtime', 'tuned control'],
        ['SQL warehouse', 'SQL and BI', 'size, auto-stop', 'analysts'],
      ],
    },
    {
      id: 'retail-choices',
      kind: 'list',
      label: 'Retail flow: provisional choices',
      items: [
        'Nightly ingest + transform: serverless job',
        'Analyst and dashboard queries: SQL warehouse',
        'Needs runtime-level control: classic',
        'Revisit with measurements in Chapter 9',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'compute-table', target: 'retail-choices' }],
}
