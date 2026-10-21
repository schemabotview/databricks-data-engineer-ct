import type { Scene, SceneNode } from '@graphlearning/flow'

// Lineage and audit as evidence (DOCUMENTED: system.access.table_lineage and system.access.audit, via
// search summaries — column names must be re-checked against the live docs; system tables must be
// enabled). The result row is ILLUSTRATIVE, not a run.
const hop = (id: string, label: string, sub: string, icon: string): SceneNode => ({ id, label, sub, icon, pattern: 'storage' })

const QUERY = [
  '-- what fed retail.gold.sales?',
  'SELECT source_table_full_name,',
  '       target_table_full_name,',
  '       entity_type, event_time',
  'FROM system.access.table_lineage',
  "WHERE target_table_full_name = 'retail.gold.sales'",
  'ORDER BY event_time DESC;',
].join('\n')

export const lineage: Scene = {
  id: 'lineage-audit',
  framed: true,
  padding: 0.04,
  nodes: [
    {
      id: 'chain',
      label: 'What fed the gold table — captured as queries run (documented)',
      pattern: 'storage',
      icon: 'none',
      flow: 'LR',
      children: [
        hop('l-landing', 'landing — volume', 'CSV files', 'folder'),
        hop('l-bronze', 'retail.bronze.orders', 'raw rows', 'database'),
        hop('l-silver', 'retail.silver.orders', 'typed rows', 'funnel'),
        hop('l-gold', 'retail.gold.sales', 'per city and day', 'sigma'),
      ],
      edges: [
        { source: 'l-landing', target: 'l-bronze' },
        { source: 'l-bronze', target: 'l-silver' },
        { source: 'l-silver', target: 'l-gold' },
      ],
    },
    {
      id: 'below',
      label: 'Evidence',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        { id: 'query', kind: 'code', filename: 'lineage.sql — documented, not run', label: QUERY },
        {
          id: 'right',
          label: 'Answers',
          bare: true,
          children: [
            {
              id: 'kinds',
              kind: 'table',
              label: 'Three kinds of evidence',
              headers: ['kind', 'answers', 'kept in'],
              values: [
                ['metadata', 'what is this, who owns it', 'comments, tags'],
                ['lineage', 'what fed what', 'system.access.table_lineage'],
                ['audit', 'who did what, when', 'system.access.audit'],
              ],
            },
            {
              id: 'result',
              kind: 'table',
              label: 'An illustrative result — not a run',
              headers: ['source', 'target'],
              values: [['retail.silver.orders', 'retail.gold.sales']],
            },
          ],
        },
      ],
    },
  ],
  edges: [],
}
