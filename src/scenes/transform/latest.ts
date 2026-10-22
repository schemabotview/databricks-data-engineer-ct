import type { Scene } from '@graphlearning/flow'
import { transformFrame } from './frame'
import code from '../../../spine/transform/05-latest/project/tools/transform/latest.py?raw'
import raw from '../../../spine/transform/05-latest/session.txt?raw'

// row_number() over the order id, latest file first — a real run (spine/transform/05): o4 kept from
// orders-c.csv, o6 from orders-d.csv. Ordered by amount alone, twelve shuffles of the same o4 rows keep
// different files (the step is volatile: which ones is chance).
export const latest: Scene = transformFrame('window-dedupe', 5, 'tools/transform/latest.py', { code, show: [[9, 23]], highlight: [11, 12, 13, 15, 17, 19, 21, 22, 23], terminal: raw }, ['tools/transform/latest.py'], {
  id: 'latest-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'kept',
      kind: 'table',
      label: 'Who wins, and why',
      headers: ['order', 'kept', 'because'],
      values: [
        ['o4', 'orders-c', 'same row, later file'],
        ['o6', 'orders-d', 'COMPLETED came later'],
        ['o4 by amount', 'either', 'a tie: chance'],
      ],
    },
    {
      id: 'latest-facts',
      kind: 'list',
      icon: 'sortarrows',
      label: 'A deterministic dedupe',
      pattern: 'service',
      items: [
        'PARTITION BY the key, ORDER BY what “latest” means',
        'The ORDER BY must be total: no ties',
        'Add a tie-breaker that is unique per row',
        'Same input, same survivor, every run',
      ],
    },
  ],
})
