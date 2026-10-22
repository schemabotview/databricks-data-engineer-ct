import type { Scene } from '@graphlearning/flow'

// Streaming tables, materialized views and temporary views — DOCUMENTED, not run (Lakeflow
// Declarative Pipelines SQL: CREATE OR REFRESH STREAMING TABLE / MATERIALIZED VIEW, CREATE TEMPORARY
// VIEW, STREAM(...) / read_files; checked through search summaries of the docs).
const SQL = [
  '-- documented, not run: pipeline SQL needs a workspace',
  'CREATE OR REFRESH STREAMING TABLE bronze_orders',
  'AS SELECT *, _metadata.file_name AS source_file',
  'FROM STREAM read_files(',
  "  '/Volumes/retail/bronze/landing/orders/', format => 'csv');",
  '',
  'CREATE TEMPORARY VIEW typed_orders AS',
  'SELECT order_id, try_cast(amount AS DECIMAL(10,2)) AS amount,',
  '       try_cast(store_id AS INT) AS store_id, status',
  'FROM STREAM(bronze_orders);',
  '',
  'CREATE OR REFRESH MATERIALIZED VIEW gold_sales AS',
  'SELECT city, count(*) AS orders, sum(amount) AS sales',
  'FROM silver_orders JOIN retail.reference.stores USING (store_id)',
  "WHERE status = 'COMPLETED' GROUP BY city;",
].join('\n')

export const datasetKinds: Scene = {
  id: 'dataset-kinds',
  framed: true,
  padding: 0.03,
  flow: 'LR',
  align: 'start',
  nodes: [
    { id: 'kinds-sql', kind: 'code', filename: 'the same datasets in pipeline SQL — documented', label: SQL, highlight: [2, 4, 7, 10, 12] },
    {
      id: 'kinds-right',
      label: 'kinds-right',
      bare: true,
      children: [
        {
          id: 'kinds',
          kind: 'table',
          label: 'Three kinds of dataset (documented)',
          headers: ['', 'reads', 'on each update', 'use it for'],
          values: [
            ['streaming table', 'a stream', 'only the new rows', 'bronze, silver'],
            ['materialized view', 'a batch', 'a correct full result', 'gold, joins, sums'],
            ['temporary view', 'either', 'nothing is stored', 'a step in between'],
          ],
        },
        {
          id: 'kinds-facts',
          kind: 'list',
          icon: 'layers',
          label: 'Choosing one',
          pattern: 'service',
          items: [
            'Append-only source, read once: a streaming table',
            'A result that must stay right as inputs change: a view',
            'A view may be refreshed incrementally, or recomputed',
            'Its answer is the same either way; only the cost differs',
            'A temporary view is visible inside the pipeline only',
          ],
        },
      ],
    },
  ],
  edges: [],
}
