import type { Scene } from '@graphlearning/flow'

// §7.3 — the dependency graph a pipeline derives from what each dataset reads. DOCUMENTED, NOT RUN.
// The pipeline works out the order itself; nothing here is an explicit task dependency. Sinks beyond
// pipeline tables are documented as a separate feature whose availability must be checked.
export const pipelineGraph: Scene = {
  id: 'pipeline-graph',
  title: 'The graph comes from what each dataset reads',
  flow: 'LR',
  nodes: [
    {
      id: 'dataset-chain',
      label: 'Datasets in dependency order',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'node-landing', label: 'landing volume', sub: 'CSV files', pattern: 'storage', icon: 'folder' },
        { id: 'node-bronze', label: 'bronze_orders', sub: 'streaming table', pattern: 'storage', icon: 'database' },
        { id: 'node-typed', label: 'typed_orders', sub: 'view', pattern: 'service', icon: 'search' },
        { id: 'node-silver', label: 'silver_orders', sub: 'streaming table', pattern: 'storage', icon: 'funnel' },
        { id: 'node-gold', label: 'gold_sales', sub: 'materialized view', pattern: 'storage', icon: 'sigma' },
      ],
      edges: [
        { source: 'node-landing', target: 'node-bronze' },
        { source: 'node-bronze', target: 'node-typed' },
        { source: 'node-typed', target: 'node-silver' },
        { source: 'node-silver', target: 'node-gold' },
      ],
    },
    {
      id: 'graph-evidence',
      label: 'How it is declared',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'reads-code',
          kind: 'code',
          filename: 'dependencies  (documented)',
          label: `-- a read is a dependency
FROM STREAM(bronze_orders)
FROM STREAM(typed_orders)
FROM silver_orders`,
        },
        {
          id: 'sinks-list',
          kind: 'list',
          label: 'Flows and sinks (documented)',
          items: ['a flow feeds one target', 'tables are the default target', 'other sinks: check availability'],
          framed: true,
        },
      ],
    },
  ],
  edges: [{ source: 'dataset-chain', target: 'graph-evidence' }],
}
