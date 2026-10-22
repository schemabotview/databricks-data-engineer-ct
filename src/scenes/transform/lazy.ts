import type { Scene } from '@graphlearning/flow'
import { transformFrame } from './frame'
import code from '../../../spine/transform/01-lazy/project/tools/transform/lazy.py?raw'
import raw from '../../../spine/transform/01-lazy/session.txt?raw'

// Jobs counted from Spark's status tracker before and after an action, and the plan's shuffles — a
// real run (spine/transform/01) over 11 bronze events: CANCELLED 1, COMPLETED 8, PENDING 2.
export const lazy: Scene = transformFrame('spark-model', 1, 'tools/transform/lazy.py', { code, show: [[7, 21]], highlight: [10, 11, 12, 13, 14, 18, 19, 20], terminal: raw }, ['data/samples/orders-d.csv', 'tools/transform/lazy.py'], {
  id: 'lazy-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'words',
      kind: 'table',
      label: 'The four words you need here',
      headers: ['word', 'means'],
      values: [
        ['transformation', 'a step in the plan'],
        ['action', 'run the plan now'],
        ['partition', 'a piece one task reads'],
        ['shuffle', 'rows move between pieces'],
      ],
    },
    {
      id: 'lazy-facts',
      kind: 'list',
      icon: 'spark',
      label: 'The rest is the Spark course',
      pattern: 'service',
      items: [
        'Nothing ran until collect() asked for rows',
        'GROUP BY and ORDER BY each move rows: a shuffle',
        'File d arrived: bronze now has 11 events',
        'Plans, stages and tuning: apache-spark',
      ],
    },
  ],
})
