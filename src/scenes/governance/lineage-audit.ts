import type { Scene } from '@graphlearning/flow'

// §2.6 — lineage as a chain of objects, and a lineage query against the system tables. DOCUMENTED,
// NOT EXECUTED: the output row is ILLUSTRATIVE and the system-table column names must be re-checked
// against the current docs. System tables must be enabled for the account/metastore to be queried.
export const lineageAudit: Scene = {
  id: 'lineage-audit',
  title: 'Lineage and audit evidence',
  flow: 'LR',
  nodes: [
    {
      id: 'lineage-chain',
      label: 'What fed the gold table',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'landing-volume', label: 'landing volume', sub: 'CSV files', pattern: 'storage', icon: 'folder' },
        { id: 'bronze-orders', label: 'bronze.orders', sub: 'raw rows', pattern: 'storage', icon: 'database' },
        { id: 'silver-orders', label: 'silver.orders', sub: 'typed rows', pattern: 'storage', icon: 'funnel' },
        { id: 'gold-sales', label: 'gold.sales', sub: 'store totals', pattern: 'storage', icon: 'sigma' },
      ],
      edges: [
        { source: 'landing-volume', target: 'bronze-orders' },
        { source: 'bronze-orders', target: 'silver-orders' },
        { source: 'silver-orders', target: 'gold-sales' },
      ],
    },
    {
      id: 'lineage-evidence',
      label: 'Ask the system tables',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'lineage-query',
          kind: 'code',
          filename: 'lineage.sql  (documented, not run)',
          label: `SELECT source_table_full_name,
           target_table_full_name
    FROM system.access.table_lineage
    WHERE target_table_full_name
          = 'retail.gold.sales';`,
        },
        {
          id: 'evidence-kinds',
          kind: 'list',
          label: 'Three kinds of evidence',
          items: ['metadata: names, comments, tags', 'lineage: what fed what', 'audit: who did what, when'],
          framed: true,
        },
        {
          id: 'lineage-result',
          kind: 'table',
          label: 'Illustrative result',
          sub: 'not a real run',
          headers: ['source', 'target'],
          values: [['retail.silver.orders', 'retail.gold.sales']],
        },
      ],
    },
  ],
  edges: [{ source: 'lineage-chain', target: 'lineage-evidence' }],
}
