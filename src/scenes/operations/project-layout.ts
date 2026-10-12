import type { Scene } from '@graphlearning/flow'

// §10.1 — the real example project in examples/retail_etl (its tests run locally, see
// scripts/verify/ch10_operations.py). The bundle files are documented, not validated. Which side of the
// local/remote line each activity belongs on is the point of the list.
export const projectLayout: Scene = {
  id: 'project-layout',
  title: 'A project tree with a local and a remote side',
  flow: 'TB',
  nodes: [
    {
      id: 'tree-card',
      kind: 'code',
      filename: 'examples/retail_etl/',
      label: `retail_etl/
  databricks.yml        bundle: where it deploys
  pyproject.toml        the package and its tests
  resources/
    retail_daily.yml    the job definition
  src/retail_etl/
    transform.py        pure functions, no I/O
  tests/
    test_transform.py   runs locally`,
    },
    {
      id: 'boundary-table',
      kind: 'table',
      label: 'Where each activity belongs',
      sub: 'local, remote, or Git',
      headers: ['Activity', 'Where'],
      values: [
        ['unit tests', 'local PySpark'],
        ['exploration', 'a notebook'],
        ['scheduled runs', 'a job in a workspace'],
        ['the source of truth', 'Git'],
      ],
    },
  ],
  edges: [{ source: 'tree-card', target: 'boundary-table' }],
}
