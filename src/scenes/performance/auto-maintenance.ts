import type { Scene } from '@graphlearning/flow'

// §9.7 — what predictive optimisation automates, and who it applies to. DOCUMENTED, NOT RUN, per search
// summaries of the Databricks docs: it runs on Unity Catalog managed tables, performs OPTIMIZE (incremental
// clustering), VACUUM and ANALYZE, does not run Z-order, is not available in every region, and is on by
// default for accounts created on or after 2024-11-11 with older accounts migrating. Automatic liquid
// clustering (CLUSTER BY AUTO) is documented to need predictive optimisation and a recent runtime.
export const autoMaintenance: Scene = {
  id: 'auto-maintenance',
  title: 'What automatic maintenance takes over',
  flow: 'TB',
  nodes: [
    {
      id: 'maintenance-table',
      kind: 'table',
      label: 'Maintenance, by hand or automatic',
      sub: 'documented, not run',
      headers: ['Job', 'By hand', 'Predictive optimization'],
      values: [
        ['compact and cluster', 'OPTIMIZE', 'yes (incremental)'],
        ['remove old files', 'VACUUM', 'yes'],
        ['refresh statistics', 'ANALYZE', 'yes'],
        ['Z-order', 'OPTIMIZE ZORDER BY', 'not run by it'],
      ],
    },
    {
      id: 'eligibility-notes',
      kind: 'list',
      label: 'Eligibility and what stays yours',
      items: [
        'Unity Catalog managed tables only',
        'not available in every region',
        'check whether your account has it on',
        'you still own retention and cost review',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'maintenance-table', target: 'eligibility-notes' }],
}
