import type { Scene } from '@graphlearning/flow'

// §1.2 — who does which job, drawn beside what one Delta table actually is on disk. The code card
// is the directory and first commit of `bronze_orders`, created by a LOCAL run of PySpark 4.0.1 with
// Delta Lake 4.0.0 (two partitions, so two Parquet files). Action names are the real keys of
// 00000000000000000000.json in commit order; file names are shortened with an ellipsis.
export const lakehouseStack: Scene = {
  id: 'lakehouse-stack',
  title: 'Spark, Delta and Databricks: three jobs',
  flow: 'TB',
  nodes: [
    {
      id: 'stack',
      label: 'Who does what',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'databricks-layer', label: 'Databricks', sub: 'runs, secures, governs', pattern: 'service', icon: 'cpu' },
        { id: 'spark-layer', label: 'Apache Spark', sub: 'the query engine', pattern: 'service', icon: 'zap' },
        { id: 'delta-layer', label: 'Delta Lake', sub: 'log turns files into a table', pattern: 'storage', icon: 'table' },
        { id: 'files-layer', label: 'Object storage', sub: 'Parquet files', pattern: 'storage', icon: 'harddrive' },
      ],
    },
    {
      id: 'delta-evidence',
      label: 'One table, on disk',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'delta-on-disk',
          kind: 'code',
          filename: 'bronze_orders/  (local run)',
          label: `bronze_orders/
      _delta_log/
        00000000000000000000.json
      part-00000-….snappy.parquet
      part-00001-….snappy.parquet

    # 00000000000000000000.json, in order
    commitInfo  CREATE TABLE AS SELECT
    metaData    schema and format
    protocol    reader/writer versions
    add         part-00000-….parquet
    add         part-00001-….parquet`,
        },
        {
          id: 'table-checks',
          kind: 'table',
          label: 'DESCRIBE DETAIL and HISTORY',
          sub: 'bronze_orders, local run',
          headers: ['Check', 'Result'],
          values: [
            ['format', 'delta'],
            ['numFiles', '2'],
            ['version 0', 'CREATE TABLE AS SELECT'],
          ],
        },
      ],
    },
  ],
  edges: [{ source: 'stack', target: 'delta-evidence' }],
}
