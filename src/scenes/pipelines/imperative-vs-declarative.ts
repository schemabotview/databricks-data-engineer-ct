import type { Scene } from '@graphlearning/flow'

// §7.1 — the same ingestion written as a Spark application and as a pipeline definition. DOCUMENTED, NOT
// RUN: no Databricks workspace was available. API names follow the current Lakeflow Spark Declarative
// Pipelines docs as checked through search summaries; verify against the live docs before publishing.
export const imperativeVsDeclarative: Scene = {
  id: 'imperative-vs-declarative',
  title: 'You run the steps, or you declare the result',
  flow: 'TB',
  nodes: [
    {
      id: 'definition-pair',
      label: 'The same ingestion, twice',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'imperative-code',
          kind: 'code',
          filename: 'application.py  (documented)',
          label: `(spark.readStream.format("cloudFiles")
  .option("cloudFiles.format", "csv")
  .load(LANDING)
  .writeStream
  .option("checkpointLocation", CKPT)
  .toTable("bronze_orders"))`,
        },
        {
          id: 'declarative-code',
          kind: 'code',
          filename: 'pipeline.sql  (documented, not run)',
          label: `CREATE OR REFRESH STREAMING TABLE
  bronze_orders
AS SELECT * FROM STREAM read_files(
  '/Volumes/retail/bronze/landing/',
  format => 'csv', header => true);`,
        },
      ],
    },
    {
      id: 'who-handles',
      kind: 'table',
      label: 'Who handles what',
      sub: 'typical split, documented',
      headers: ['Concern', 'Application', 'Pipeline'],
      values: [
        ['Order of steps', 'you', 'the pipeline'],
        ['Checkpoints', 'you', 'the pipeline'],
        ['Retries', 'you', 'the pipeline'],
        ['Business logic', 'you', 'you'],
      ],
    },
  ],
  edges: [{ source: 'definition-pair', target: 'who-handles' }],
}
