import type { Scene } from '@graphlearning/flow'
import { transformFrame } from './frame'
import code from '../../../spine/transform/03-types/project/tools/transform/types_and_time.py?raw'
import raw from '../../../spine/transform/03-types/session.txt?raw'

// try_cast, `= NULL` against `IS NULL`, one timestamp text in two session time zones, and explode
// inflating a sum — a real run (spine/transform/03): 0 vs 1, 4.0 hours, 65.00 → 105.00.
export const types: Scene = transformFrame('types-nulls-time', 3, 'tools/transform/types_and_time.py', { code, show: [[9, 25]], highlight: [9, 12, 15, 16, 20, 23, 24], terminal: raw }, ['tools/transform/types_and_time.py'], {
  id: 'types-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'traps',
      kind: 'table',
      label: 'Four ways to be quietly wrong',
      headers: ['trap', 'what happened'],
      values: [
        ['CAST', 'fails a whole job on "n/a"'],
        ['= NULL', 'is never true: 0 rows'],
        ['a time without a zone', 'two instants, 4 h apart'],
        ['explode, then sum', '65.00 became 105.00'],
      ],
    },
    {
      id: 'types-facts',
      kind: 'list',
      icon: 'shieldcheck',
      label: 'Habits that prevent them',
      pattern: 'service',
      items: [
        'try_cast, then count the NULLs it made',
        'IS NULL / IS NOT NULL, never = NULL',
        'Store times in UTC; convert to show them',
        'Aggregate before you explode, or after you dedupe',
      ],
    },
  ],
})
