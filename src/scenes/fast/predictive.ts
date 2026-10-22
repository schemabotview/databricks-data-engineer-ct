import type { Scene, SceneNode } from '@graphlearning/flow'

// Predictive optimization — DOCUMENTED (Unity Catalog managed tables; runs OPTIMIZE, VACUUM and
// ANALYZE; no Z-order; not all regions; on by default for accounts created from 2024-11-11; CLUSTER BY
// AUTO needs it — via search summaries). Nothing here is run.
const op = (id: string, label: string, sub: string, icon: string): SceneNode => ({ id, label, sub, icon, pattern: 'network' })

export const predictive: Scene = {
  id: 'fast-predictive',
  framed: true,
  padding: 0.03,
  align: 'start',
  nodes: [
    {
      id: 'does',
      label: 'What it runs for you (documented)',
      pattern: 'network',
      icon: 'none',
      flow: 'LR',
      children: [
        op('optimize', 'OPTIMIZE', 'compaction and clustering: §5, §6', 'package'),
        op('vacuum', 'VACUUM', 'old files past retention: Course 5', 'trash'),
        op('analyze', 'ANALYZE', 'statistics for the planner', 'barchart'),
      ],
      edges: [],
    },
    {
      id: 'pred-below',
      label: 'pred-below',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'eligible',
          kind: 'table',
          label: 'Where it applies (documented, re-check)',
          headers: ['question', 'answer'],
          values: [
            ['which tables', 'Unity Catalog managed tables'],
            ['Z-order', 'not run by it'],
            ['regions', 'not all of them'],
            ['default', 'on for accounts created from 2024-11-11'],
            ['CLUSTER BY AUTO', 'needs it enabled'],
          ],
        },
        {
          id: 'pred-facts',
          kind: 'list',
          icon: 'gauge',
          label: 'Still yours',
          pattern: 'warn',
          items: [
            'Choosing what to cluster by, unless AUTO',
            'Retention long enough for time travel and recovery',
            'External tables: maintain them yourself',
            'Checking it ran: its history is in a system table',
          ],
        },
      ],
    },
  ],
  edges: [],
}
