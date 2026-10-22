import type { Scene } from '@graphlearning/flow'
import { changesFrame } from './frame'
import code from '../../../spine/changes/03-state/project/tools/changes/state.py?raw'
import raw from '../../../spine/changes/03-state/session.txt?raw'

// dropDuplicates on (order_id, event_ts), with and without a watermark — a real run (spine/changes/03):
// state 3, 5, 7, 9 rows and growing, against 3, 3, 4, 3, 1; 9 kept against 8 (o12 is late).
export const state: Scene = changesFrame('stream-state', 3, 'tools/changes/state.py', { code, show: [[4, 19]], highlight: [11, 14, 17], terminal: raw }, ['tools/changes/state.py'], {
  id: 'state-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'state-rows',
      kind: 'table',
      label: 'Keys the stream must remember',
      headers: ['', 'state rows', 'kept'],
      values: [
        ['no watermark', '3 → 5 → 7 → 9', '9 of 10'],
        ['10-minute watermark', '3 → 3 → 4 → 3 → 1', '8 of 10'],
      ],
    },
    {
      id: 'state-facts',
      kind: 'list',
      icon: 'database',
      label: 'State is the price of “have I seen this?”',
      pattern: 'service',
      items: [
        'Every key seen is kept, until something says it can go',
        'Without a watermark that is never: state only grows',
        'With one, a key expires once it is older than the watermark',
        'Both drop the resent o4; the watermark also drops late o12',
        'Deduplicate on the event time column, or nothing expires',
      ],
    },
  ],
})
