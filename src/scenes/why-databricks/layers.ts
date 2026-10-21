import type { Scene, SceneNode } from '@graphlearning/flow'

// An engine, a table format and a platform. What each one is and is not; the Unity Catalog line is
// documented (it was open-sourced in 2024 under the LF AI & Data Foundation), not run here.
const layer = (id: string, badge: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern'], items: string[]): SceneNode =>
  ({ id, kind: 'list', badge, label, sub, icon, pattern, items })

export const layers: Scene = {
  id: 'spark-delta-databricks',
  framed: true,
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'stack',
      label: 'Three layers, three jobs',
      bare: true,
      flow: 'LR',
      align: 'start',
      stretch: true,
      children: [
        layer('spark', '1', 'Apache Spark', 'an engine — open source', 'spark', 'service', [
          'Splits a query into tasks over many machines',
          'SQL, DataFrames and streaming in one engine',
          'Reads and writes files; stores nothing itself',
          'Taught in its own course: Apache Spark',
        ]),
        layer('delta', '2', 'Delta Lake', 'a table format — open source', 'layers', 'storage', [
          'A transaction log beside Parquet files',
          'Atomic commits: a write lands whole or not at all',
          'Versions, history, MERGE, schema enforcement',
          'Files and a log — not a database server',
        ]),
        layer('platform', '3', 'Databricks', 'a platform — a commercial service', 'cloud', 'network', [
          'Runs Spark and Delta on compute it manages',
          'Unity Catalog: names, grants, lineage, audit',
          'Ingestion, declarative pipelines, scheduled jobs',
          'Workspace, notebooks, deployment and monitoring',
        ]),
      ],
      edges: [
        { source: 'spark', target: 'delta' },
        { source: 'delta', target: 'platform' },
      ],
    },
    {
      id: 'who',
      kind: 'table',
      label: 'Which layer answers the question',
      headers: ['question', 'answered by', 'course'],
      values: [
        ['run this query on fifty machines', 'Spark', 'Apache Spark'],
        ['which files make up the table right now?', 'Delta’s log', '5 · Make the table reliable'],
        ['what did the table look like yesterday?', 'Delta’s history', '5 · Make the table reliable'],
        ['who may read the gold table?', 'Unity Catalog', '4 · Govern it'],
        ['what starts the job at 05:00, and on what?', 'Lakeflow Jobs, compute', '10 · Schedule it'],
      ],
    },
  ],
  edges: [],
}
