import type { Scene } from '@graphlearning/flow'
import { changesFrame } from './frame'
import code from '../../../spine/changes/04-joins/project/tools/changes/joins.py?raw'
import raw from '../../../spine/changes/04-joins/session.txt?raw'

// Orders joined to payments within 15 minutes, both sides watermarked — a real run (spine/changes/04):
// inner and left outer agree until the last batch, where o10 (paid 24 minutes later) comes out unpaid.
export const joins: Scene = changesFrame('stream-joins', 4, 'tools/changes/joins.py', { code, show: [[12, 13], [16, 27]], highlight: [13, 16, 17, 19, 20], terminal: raw }, ['data/samples/stream/payments', 'tools/changes/joins.py'], {
  id: 'joins-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'pairs',
      kind: 'table',
      label: 'Who was paid within 15 minutes',
      headers: ['orders', 'paid', 'result'],
      values: [
        ['o1 o2 o4×2 o5 o11 o13', 'within 15 min', 'joined'],
        ['o10', '24 min later', 'unpaid (outer)'],
        ['o6', 'never', 'still waiting'],
        ['o12', 'never', 'dropped: late'],
      ],
    },
    {
      id: 'join-facts',
      kind: 'list',
      icon: 'link',
      label: 'Bounded state on both sides',
      pattern: 'service',
      items: [
        'Each side keeps its rows until no match can still come',
        'The time bound plus the watermarks decide when that is',
        'An outer row is written only once its match is impossible',
        'Without a bound, both sides are kept forever',
      ],
    },
  ],
})
