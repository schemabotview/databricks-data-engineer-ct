import type { Scene } from '@graphlearning/flow'

// §4.3 — the Auto Loader (`cloudFiles`) shape. DOCUMENTED, NOT RUN: it is a Databricks source. Option
// names must be re-checked against the current docs. The paths are Volumes paths; SCHEMA_DIR and
// CKPT_DIR stand for locations you choose.
export const autoLoader: Scene = {
  id: 'auto-loader',
  title: 'Auto Loader in PySpark',
  flow: 'TB',
  nodes: [
    {
      id: 'autoloader-code',
      kind: 'code',
      filename: 'ingest.py  (documented, not run)',
      label: `(spark.readStream.format("cloudFiles")
  .option("cloudFiles.format", "csv")
  .option("cloudFiles.schemaLocation", SCHEMA_DIR)
  .load("/Volumes/retail/bronze/landing/")
  .writeStream
  .option("checkpointLocation", CKPT_DIR)
  .trigger(availableNow=True)
  .toTable("retail.bronze.orders"))`,
    },
    {
      id: 'cloudfiles-adds',
      kind: 'list',
      label: 'What cloudFiles adds (documented)',
      items: [
        'finds only files not yet seen',
        'infers and tracks the schema',
        'keeps unexpected data, not drops it',
        'scales file discovery',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'autoloader-code', target: 'cloudfiles-adds' }],
}
