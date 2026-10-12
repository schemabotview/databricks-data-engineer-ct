import type { Scene } from '@graphlearning/flow'

// §7.2 — the three dataset kinds in a pipeline. DOCUMENTED, NOT RUN. Refresh behaviour is described at
// the level the docs state it; which refresh technique a materialized view uses is the platform's choice.
export const datasetKinds: Scene = {
  id: 'dataset-kinds',
  title: 'Streaming table, materialized view, view',
  flow: 'TB',
  nodes: [
    {
      id: 'kinds-table',
      kind: 'table',
      label: 'Three datasets, three jobs',
      sub: 'documented, not run',
      headers: ['Kind', 'Reads', 'Stored?', 'Use for'],
      values: [
        ['Streaming table', 'a stream, once', 'yes', 'ingest, append'],
        ['Materialized view', 'a query', 'yes', 'summaries, joins'],
        ['View', 'a query', 'no', 'reuse inside'],
      ],
    },
    {
      id: 'kinds-code',
      kind: 'code',
      filename: 'kinds.sql  (documented, not run)',
      label: `CREATE OR REFRESH STREAMING TABLE bronze_orders ...;
CREATE OR REFRESH MATERIALIZED VIEW gold_sales ...;
CREATE TEMPORARY VIEW typed_orders ...;`,
    },
    {
      id: 'kinds-notes',
      kind: 'list',
      label: 'In one line each',
      items: ['streaming table: input processed once', 'materialized view: stored, kept current', 'view: a named query, nothing stored'],
      framed: true,
    },
  ],
  edges: [
    { source: 'kinds-table', target: 'kinds-code' },
    { source: 'kinds-code', target: 'kinds-notes' },
  ],
}
