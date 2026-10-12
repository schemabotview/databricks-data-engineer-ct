import type { Scene } from '@graphlearning/flow'

// §2.2 — tabular objects versus file access. DOCUMENTED, NOT EXECUTED. The privilege names (SELECT,
// READ VOLUME) are Unity Catalog's; the volume path form is /Volumes/<catalog>/<schema>/<volume>/...
export const tablesVsVolumes: Scene = {
  id: 'tables-vs-volumes',
  title: 'Tabular access and file access',
  flow: 'TB',
  nodes: [
    {
      id: 'securables-table',
      kind: 'table',
      label: 'Three securables',
      sub: 'what each holds and how you reach it',
      headers: ['Object', 'Holds', 'Reached by', 'Needs'],
      values: [
        ['Table', 'rows, schema', 'SQL name', 'SELECT'],
        ['View', 'a saved query', 'SQL name', 'SELECT'],
        ['Volume', 'any files', '/Volumes path', 'READ VOLUME'],
      ],
    },
    {
      id: 'access-examples',
      label: 'The same landing data, two ways in',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'table-access',
          kind: 'code',
          filename: 'tabular.sql',
          label: `SELECT count(*)
FROM retail.bronze.orders;`,
        },
        {
          id: 'volume-access',
          kind: 'code',
          filename: 'files.py',
          label: `spark.read.csv(
  "/Volumes/retail/bronze/landing/"
  "orders/2026-10-01.csv", header=True)`,
        },
      ],
    },
  ],
  edges: [{ source: 'securables-table', target: 'access-examples' }],
}
