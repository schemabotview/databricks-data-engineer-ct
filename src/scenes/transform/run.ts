import type { Scene } from '@graphlearning/flow'
import { transformFrame } from './frame'
import code from '../../../spine/transform/08-run/project/src/retail/run.py?raw'
import raw from '../../../spine/transform/08-run/session.txt?raw'

// The whole flow, landed files to gold, reconciled — a real run (spine/transform/08): 11 = 6 + 1 + 1 + 3,
// gold Hull 1 / 80.00, Leeds 3 / 75.00, York 1 / 15.00, detail 170.00 = summary 170.00.
export const run: Scene = transformFrame('silver-gold-flow', 8, 'src/retail/run.py', { code, show: [[7, 22]], highlight: [8, 9, 10, 16, 17, 18, 19, 21], terminal: raw }, ['src/retail/run.py'], {
  id: 'run-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'flow',
      kind: 'table',
      label: 'Landed files to gold',
      headers: ['layer', 'rows'],
      values: [
        ['bronze.orders', '11'],
        ['silver.quarantine', '3'],
        ['silver.orders', '6'],
        ['gold.sales', '3 cities, 170.00'],
      ],
    },
    {
      id: 'run-facts',
      kind: 'list',
      icon: 'workflow',
      label: 'Detail = summary',
      pattern: 'storage',
      items: [
        'Completed in silver sum to gold: 170.00',
        'Course 1’s 160.00 had o6 still pending',
        'Every run checks both sides, or says why not',
        'Course 8: what if rows keep changing?',
      ],
    },
  ],
})
