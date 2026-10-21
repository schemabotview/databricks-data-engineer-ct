import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { quietIvy } from './ivy'
import { startTree } from './tree'
import code from '../../../spine/start/05-first-query/project/tools/first_query.py?raw'
import raw from '../../../spine/start/05-first-query/session.txt?raw'

export const firstQuery: Scene = ideFrame(
  'first-query',
  'retail-lakehouse',
  startTree(5, 'tools/first_query.py', ['tools/first_query.py']),
  { file: 'tools/first_query.py', code, show: [[4, 20]], highlight: [8, 9, 10, 11, 12, 13, 14, 15, 16, 19], terminal: quietIvy(raw) },
  {
    id: 'first-query-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'sql-vs-python',
        kind: 'table',
        label: 'One question, two spellings',
        headers: ['SQL', 'PySpark'],
        values: [
          ['FROM bronze.orders', 'spark.table(…)'],
          ['GROUP BY status', '.groupBy("status")'],
          ['count(*) AS orders', '.agg(F.count("*")…)'],
          ['ORDER BY status', '.orderBy("status")'],
        ],
      },
      {
        id: 'first-query-facts',
        kind: 'list',
        icon: 'search',
        label: 'Same plan, same rows',
        pattern: 'service',
        items: [
          'Both build a plan; show() and collect() run it',
          'Use whichever reads better — Course 7 mixes them',
          'Six completed orders? Look again at the eight rows',
        ],
      },
    ],
  },
)
