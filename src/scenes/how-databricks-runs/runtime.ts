import type { Scene, SceneNode } from '@graphlearning/flow'

// What a Databricks Runtime release bundles (DOCUMENTED: runtime release notes, via search
// summaries) beside the local stack this course runs, whose versions are a real run
// (scripts/verify/c02_how_databricks_runs.py). No Runtime-to-Spark version mapping is quoted: check the
// release notes of the Runtime you use.
const STACK = [
  '# the local session every course from 3 on builds',
  'import sys, pyspark, importlib.metadata as md',
  'jvm = spark.sparkContext._jvm',
  '',
  'sys.version[:4]               # 3.13  — Python',
  'pyspark.__version__           # 4.0.1',
  'spark.version                 # 4.0.1 — the engine',
  'md.version("delta-spark")     # 4.0.0 — Delta Lake',
  'jvm.java.lang.System.getProperty("java.version")',
  '                              # 21.x  — OpenJDK',
  'spark.conf.get("spark.master")  # local[2]',
].join('\n')

const side = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern'], items: string[]): SceneNode =>
  ({ id, kind: 'list', label, sub, icon, pattern, items })

export const runtime: Scene = {
  id: 'databricks-runtime',
  framed: true,
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'pair',
      label: 'One engine, two packagings',
      bare: true,
      flow: 'LR',
      align: 'start',
      stretch: true,
      children: [
        side('dbr', 'A Databricks Runtime release', 'chosen per cluster or job (documented)', 'cloud', 'network', [
          'One pinned version of Apache Spark',
          'Delta Lake, with Databricks-only table features',
          'Auto Loader, Unity Catalog integration, Photon (optional)',
          'Python, Java and a set of preinstalled libraries',
          'LTS releases are supported for longer',
          'Serverless picks the version for you',
        ]),
        {
          id: 'local',
          label: 'This course’s local stack (run)',
          sub: 'open source, on one machine',
          pattern: 'service',
          icon: 'spark',
          children: [{ id: 'stack', kind: 'code', filename: 'versions — local run', label: STACK }],
        },
      ],
    },
    {
      id: 'same',
      kind: 'table',
      label: 'What runs the same, and what does not',
      headers: ['', 'Databricks Runtime', 'local stack', 'so in this course'],
      values: [
        ['Spark SQL, DataFrames, streaming', 'yes', 'yes', 'run'],
        ['Delta: log, MERGE, history, VACUUM', 'yes', 'yes', 'run'],
        ['file and task counts', 'its own', 'local[2]', 'never compared'],
        ['Unity Catalog, grants', 'yes', 'no', 'documented'],
        ['Auto Loader, pipelines, jobs', 'yes', 'no', 'documented'],
        ['Photon, predictive optimization', 'yes', 'no', 'documented'],
      ],
    },
  ],
  edges: [],
}
