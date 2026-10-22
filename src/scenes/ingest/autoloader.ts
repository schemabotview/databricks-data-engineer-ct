import type { Scene, SceneNode } from '@graphlearning/flow'

// Auto Loader, DOCUMENTED (Databricks Auto Loader docs, via search summaries; option names
// cloudFiles.format, cloudFiles.schemaLocation, cloudFiles.schemaEvolutionMode, and the _rescued_data
// column). Not run: `cloudFiles` exists only on Databricks. The local column is this course's analogue,
// which IS run in the next lesson.
const AUTO = [
  '# documented, not run: cloudFiles is a Databricks source',
  'orders = (spark.readStream.format("cloudFiles")',
  '    .option("cloudFiles.format", "csv")',
  '    .option("header", "true")',
  '    .option("cloudFiles.schemaLocation",',
  '            "/Volumes/retail/bronze/_schemas/orders")',
  '    .load("/Volumes/retail/bronze/landing/orders/"))',
  '',
  '(orders.writeStream',
  '    .option("checkpointLocation",',
  '            "/Volumes/retail/bronze/_checkpoints/orders")',
  '    .trigger(availableNow=True)',
  '    .toTable("retail.bronze.orders"))',
].join('\n')

const add = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon, pattern })

export const autoloader: Scene = {
  id: 'auto-loader',
  framed: true,
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  nodes: [
    { id: 'auto-code', kind: 'code', filename: 'bronze_autoloader.py — documented', label: AUTO },
    {
      id: 'right',
      label: 'What it adds',
      bare: true,
      children: [
        {
          id: 'adds',
          label: 'What Auto Loader adds over a plain file stream (documented)',
          pattern: 'network',
          icon: 'none',
          cols: 2,
          children: [
            add('discover', 'Finds new files cheaply', 'listing, or notifications from the bucket', 'search', 'network'),
            add('schema', 'Infers and tracks a schema', 'kept at schemaLocation', 'table', 'network'),
            add('evolve', 'Handles new columns', 'by an evolution mode you choose', 'layers', 'network'),
            add('rescue', 'Rescues what does not fit', 'into a _rescued_data column', 'shieldcheck', 'network'),
          ],
        },
        {
          id: 'vs',
          kind: 'table',
          label: 'Auto Loader, and what this course runs instead',
          headers: ['', 'Auto Loader', 'locally (run)'],
          values: [
            ['source', 'cloudFiles', 'Spark’s file source'],
            ['progress kept in', 'a checkpoint', 'a checkpoint'],
            ['schema', 'inferred, tracked', 'declared by us'],
            ['bad values', '_rescued_data', 'a _bad_record column'],
          ],
        },
      ],
    },
  ],
  edges: [],
}
