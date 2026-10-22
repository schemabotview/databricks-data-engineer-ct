import type { Scene } from '@graphlearning/flow'
import { fold, ideFrame, lineOf } from '../ide'
import { startTree } from './tree'
import code from '../../../spine/start/03-session/project/src/retail/session.py?raw'
import raw from '../../../spine/start/03-session/session.txt?raw'

// The one frame that shows Ivy's report: its first lines say where the jars live, its last that
// nothing was downloaded. Every later frame folds it (./ivy.ts).
const session = fold(
  raw,
  [1, 3],
  [lineOf(raw, 'Ivy Default Cache'), lineOf(raw, 'io.delta#delta-spark_2.13 added')],
  [lineOf(raw, '\t0 artifacts copied'), -1],
)

export const sessionFrame: Scene = ideFrame(
  'delta-session',
  'retail-lakehouse',
  startTree(3, 'src/retail/session.py', ['conf', 'src/retail/__init__.py', 'src/retail/session.py', '.gitignore', 'pyproject.toml']),
  { file: 'src/retail/session.py', code, show: [[8, 23]], highlight: [13, 14, 15, 16, 18, 20, 23], terminal: session },
  {
    id: 'session-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'session-config',
        kind: 'table',
        label: 'What makes the session speak Delta',
        headers: ['line', 'adds'],
        values: [
          ['spark.sql.extensions', 'MERGE, VACUUM, HISTORY'],
          ['spark_catalog', 'Delta’s catalog'],
          ['sources.default', 'new tables are Delta'],
          ['enableHiveSupport()', 'names kept on disk'],
          ['configure_…_delta_pip', 'Delta’s jars'],
        ],
      },
      {
        id: 'session-ivy',
        kind: 'list',
        icon: 'package',
        label: 'The lines before our output',
        pattern: 'network',
        items: [
          'Ivy resolves Delta’s jars into ~/.ivy2.5.2',
          'Downloaded on the first run, found after',
          'Printed on every start — folded from here on',
          'On Databricks, the Runtime already has them',
        ],
      },
    ],
  },
)
