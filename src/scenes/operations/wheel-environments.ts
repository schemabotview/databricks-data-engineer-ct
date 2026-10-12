import type { Scene } from '@graphlearning/flow'

// §10.2 — a REAL wheel, built locally with pip from examples/retail_etl. The point is what the wheel does
// and does not declare: no pyspark dependency (the runtime provides Spark). How a Databricks runtime or a
// job environment isolates dependencies is DOCUMENTED, NOT RUN and stated generically.
export const wheelEnvironments: Scene = {
  id: 'wheel-environments',
  title: 'What a wheel carries, and what it leaves out',
  flow: 'TB',
  nodes: [
    {
      id: 'wheel-contents',
      kind: 'code',
      filename: 'retail_etl-0.1.0-py3-none-any.whl',
      label: `retail_etl/__init__.py
retail_etl/transform.py
retail_etl-0.1.0.dist-info/
  METADATA        Requires-Dist: pytest (test only)
  entry_points.txt
  RECORD`,
    },
    {
      id: 'dependency-table',
      kind: 'table',
      label: 'Who provides what',
      sub: 'local run; runtime side documented',
      headers: ['Library', 'Provided by'],
      values: [
        ['pyspark', 'the runtime, or your local venv'],
        ['retail_etl', 'the wheel you deploy'],
        ['pytest', 'a test extra, not deployed'],
      ],
    },
    {
      id: 'isolation-list',
      kind: 'list',
      label: 'Compatibility habits (documented)',
      items: [
        'do not pin what the runtime provides',
        'pin what only your code needs',
        'test on the runtime version you deploy to',
      ],
      framed: true,
    },
  ],
  edges: [
    { source: 'wheel-contents', target: 'dependency-table' },
    { source: 'dependency-table', target: 'isolation-list' },
  ],
}
