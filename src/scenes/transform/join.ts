import type { Scene } from '@graphlearning/flow'
import { transformFrame } from './frame'
import code from '../../../spine/transform/04-join/project/tools/transform/join_check.py?raw'
import raw from '../../../spine/transform/04-join/session.txt?raw'

// The five completed orders silver will hold, joined to the stores reference and to a copy where York
// was sent twice — a real run (spine/transform/04): 5 rows / 170.00 against 6 rows / 185.00.
export const join: Scene = transformFrame('join-cardinality', 4, 'tools/transform/join_check.py', { code, show: [[5, 7], [10, 21]], highlight: [5, 6, 7, 11, 13, 14, 15, 16, 17, 19, 20], terminal: raw }, ['data/reference', 'tools/transform/join_check.py'], {
  id: 'join-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'grain',
      kind: 'table',
      label: 'The grain decides the total',
      headers: ['joined to', 'rows', 'total'],
      values: [
        ['stores', '5', '170.00'],
        ['stores_dup', '6', '185.00'],
        ['the difference', 'o4 twice', '+15.00'],
      ],
    },
    {
      id: 'join-facts',
      kind: 'list',
      icon: 'link',
      label: 'Check the key before you join',
      pattern: 'warn',
      items: [
        'A join multiplies: n matches, n rows',
        'No error — just a bigger total',
        'Guard: GROUP BY key HAVING count(*) > 1',
        'State the grain: one row per what?',
      ],
    },
  ],
})
