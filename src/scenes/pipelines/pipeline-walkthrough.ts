import type { Scene } from '@graphlearning/flow'

// §7.8 — the whole retail pipeline and an ILLUSTRATIVE event-log excerpt. DOCUMENTED, NOT RUN. The log
// rows are written to show the kind of evidence an update leaves; they were NOT captured from a pipeline,
// and the real event-log schema must be checked against the docs. The error name in the failure list was
// reproduced in a local Delta streaming read.
export const pipelineWalkthrough: Scene = {
  id: 'pipeline-walkthrough',
  title: 'The retail pipeline and its event log',
  flow: 'TB',
  nodes: [
    {
      id: 'full-pipeline',
      kind: 'code',
      filename: 'retail_orders.sql  (documented, not run)',
      label: `CREATE OR REFRESH STREAMING TABLE
  bronze_orders
AS SELECT *, _metadata.file_name AS source_file
FROM STREAM read_files(
  '/Volumes/retail/bronze/landing/',
  format => 'csv', header => true);

CREATE TEMPORARY VIEW typed_orders AS
SELECT order_id,
  CAST(store_id AS INT) AS store_id,
  try_cast(amount AS DECIMAL(10,2)) AS amount,
  status, CAST(event_ts AS TIMESTAMP) AS event_ts,
  source_file
FROM STREAM(bronze_orders);

CREATE OR REFRESH STREAMING TABLE silver_orders;
CREATE FLOW orders_cdc AS
  AUTO CDC INTO silver_orders
FROM STREAM(typed_orders) KEYS (order_id)
SEQUENCE BY STRUCT(event_ts, source_file)
STORED AS SCD TYPE 1;

CREATE OR REFRESH MATERIALIZED VIEW gold_sales AS
SELECT store_id, count(*) AS orders,
  sum(amount) AS sales
FROM silver_orders WHERE status = 'COMPLETED'
GROUP BY store_id;`,
    },
    {
      id: 'event-evidence',
      label: 'What an update leaves behind',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'event-log-table',
          kind: 'table',
          label: 'Event log, illustrative',
          sub: 'not captured from a real run',
          headers: ['Event', 'Dataset', 'Note'],
          values: [
            ['update_progress', 'pipeline', 'RUNNING'],
            ['flow_progress', 'bronze_orders', '3 rows read'],
            ['flow_progress', 'silver_orders', 'rules: 1 dropped'],
            ['update_progress', 'pipeline', 'COMPLETED'],
          ],
        },
        {
          id: 'failure-reading',
          kind: 'list',
          label: 'Reading a failure',
          items: ['find the failed flow first', 'FAIL UPDATE rule: data stopped it', 'IGNORE_CHANGES: the source changed'],
          framed: true,
        },
      ],
    },
  ],
  edges: [{ source: 'full-pipeline', target: 'event-evidence' }],
}
