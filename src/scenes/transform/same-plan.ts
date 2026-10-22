import type { Scene } from '@graphlearning/flow'
import { transformFrame } from './frame'
import code from '../../../spine/transform/02-same-plan/project/tools/transform/same_plan.py?raw'
import raw from '../../../spine/transform/02-same-plan/session.txt?raw'

// The same aggregation in SQL and the DataFrame API: equal rows, and equal physical plans once Spark's
// expression ids are removed — a real run (spine/transform/02).
export const samePlan: Scene = transformFrame('sql-and-dataframes', 2, 'tools/transform/same_plan.py', { code, show: [[9, 15], [18, 20], [23, 25]], highlight: [9, 10, 11, 12, 13, 14, 15, 24, 25], terminal: raw }, ['tools/transform/same_plan.py'], {
  id: 'same-plan-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'when',
      kind: 'table',
      label: 'Which to write',
      headers: ['reach for', 'when'],
      values: [
        ['SQL', 'a query people will read'],
        ['DataFrames', 'logic built in a loop'],
        ['DataFrames', 'a function you can test'],
        ['either', 'the same plan runs'],
      ],
    },
    {
      id: 'same-facts',
      kind: 'list',
      icon: 'code',
      label: 'One engine underneath',
      pattern: 'service',
      items: [
        'Both are parsed into one logical plan',
        'The optimizer cannot tell them apart',
        'Store 15 is here: bronze has no rules yet',
      ],
    },
  ],
})
