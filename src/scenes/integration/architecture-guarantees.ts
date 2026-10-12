import type { Scene } from '@graphlearning/flow'

// §11.1 — the whole retail design, and which kind of component provides which guarantee. The design is
// built from Chapters 1-10; Databricks features in it (Unity Catalog, Auto Loader, pipelines, jobs) are
// DOCUMENTED, NOT RUN. The row counts behind it come from the local runs in scripts/verify/.
export const architectureGuarantees: Scene = {
  id: 'architecture-guarantees',
  title: 'The retail design and where each guarantee comes from',
  flow: 'LR',
  nodes: [
    {
      id: 'design-chain',
      label: 'Source to consumer',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'design-sources', label: 'Order files', sub: 'a contract and a retention', pattern: 'external', icon: 'folder' },
        { id: 'design-bronze', label: 'bronze_orders', sub: 'as sent, plus source file', pattern: 'storage', icon: 'database' },
        { id: 'design-silver', label: 'silver_orders', sub: 'typed, keyed, latest wins', pattern: 'storage', icon: 'funnel' },
        { id: 'design-gold', label: 'gold_sales', sub: 'per store, 170.00 at first', pattern: 'storage', icon: 'sigma' },
        { id: 'design-consumers', label: 'Consumers', sub: 'finance, dashboard', pattern: 'user', icon: 'monitor' },
      ],
      edges: [
        { source: 'design-sources', target: 'design-bronze' },
        { source: 'design-bronze', target: 'design-silver' },
        { source: 'design-silver', target: 'design-gold' },
        { source: 'design-gold', target: 'design-consumers' },
      ],
    },
    {
      id: 'guarantee-table',
      kind: 'table',
      label: 'Which component guarantees what',
      sub: 'built from Chapters 1 to 10',
      headers: ['Guarantee', 'Comes from'],
      values: [
        ['atomic commits, history', 'storage (Delta)'],
        ['one row per order', 'processing (keyed merge)'],
        ['order, retries', 'orchestration (Jobs)'],
        ['who may read', 'governance (grants)'],
        ['how far back to replay', 'the source (retention)'],
      ],
    },
  ],
  edges: [{ source: 'design-chain', target: 'guarantee-table' }],
}
