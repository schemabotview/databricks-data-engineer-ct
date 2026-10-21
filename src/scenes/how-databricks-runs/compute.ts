import type { Scene } from '@graphlearning/flow'

// Compute kinds and their idle cost, DOCUMENTED (compute and SQL warehouse docs, via search
// summaries). No prices and no start-up timings are quoted: they vary by cloud, region and plan. The
// retail choices are the course's provisional design, revisited in Course 11.
export const compute: Scene = {
  id: 'compute-choices',
  framed: true,
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'kinds',
      kind: 'table',
      label: 'Kinds of compute (documented, not run)',
      headers: ['kind', 'made for', 'machines in', 'while idle'],
      values: [
        ['all-purpose cluster', 'notebooks, exploring, shared work', 'your account', 'billed until it auto-terminates'],
        ['job compute', 'one job run, then gone', 'your account', 'nothing: it ends with the run'],
        ['classic / pro SQL warehouse', 'SQL and dashboards', 'your account', 'billed until it auto-stops'],
        ['serverless SQL warehouse', 'SQL and dashboards', 'Databricks’ account', 'billed until it auto-stops, which can be short'],
        ['serverless notebooks, jobs, pipelines', 'Python and SQL workloads', 'Databricks’ account', 'no machines kept for you'],
      ],
    },
    {
      id: 'below',
      label: 'Choosing',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'retail',
          kind: 'table',
          label: 'A provisional choice for the retail lakehouse',
          headers: ['who', 'workload', 'compute'],
          values: [
            ['ana, building', 'exploring in notebooks', 'small all-purpose, short auto-termination'],
            ['the nightly job', 'bronze → silver → gold', 'job compute or serverless jobs'],
            ['store dashboards', 'SQL, all day', 'a SQL warehouse'],
            ['finance at 06:00', 'one query a day', 'the same warehouse, already there'],
          ],
        },
        {
          id: 'terms',
          kind: 'list',
          icon: 'gauge',
          label: 'Words you will meet',
          pattern: 'service',
          items: [
            'DBU — the Databricks unit compute is billed in',
            'Auto-termination — stop an idle cluster after N minutes',
            'Access mode: standard (shared) or dedicated (one user)',
            'Unity Catalog needs a UC-capable access mode',
          ],
        },
      ],
    },
  ],
  edges: [],
}
