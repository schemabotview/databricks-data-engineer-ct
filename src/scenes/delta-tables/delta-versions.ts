import type { Scene } from '@graphlearning/flow'

// §3.1 — one table's six versions and the log actions each commit wrote. LOCAL RUN (PySpark 4.0.1 +
// Delta 4.0.0, scripts/verify/ch03_delta_tables.py). `orders` is the course's silver table; the file
// counts are layout-dependent, so the board shows ACTIONS, not file names or counts.
export const deltaVersions: Scene = {
  id: 'delta-versions',
  title: 'Six commits, six versions',
  flow: 'TB',
  nodes: [
    {
      id: 'version-table',
      kind: 'table',
      label: 'DESCRIBE HISTORY and row counts',
      sub: 'orders, local run',
      headers: ['Ver', 'Operation', 'Rows'],
      values: [
        ['0', 'CREATE TABLE', '0'],
        ['1', 'WRITE six rows', '6'],
        ['2', 'WRITE o8', '7'],
        ['3', 'UPDATE o6', '7'],
        ['4', 'DELETE o3', '6'],
        ['5', 'MERGE', '7'],
      ],
    },
    {
      id: 'log-actions',
      kind: 'code',
      filename: '_delta_log actions per commit',
      label: `v0  commitInfo metaData protocol
v1  commitInfo add add
v2  commitInfo add
v3  commitInfo add remove
v4  commitInfo remove add
v5  commitInfo add remove`,
    },
  ],
  edges: [{ source: 'version-table', target: 'log-actions' }],
}
