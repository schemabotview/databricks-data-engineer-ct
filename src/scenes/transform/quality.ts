import type { Scene } from '@graphlearning/flow'
import { transformFrame } from './frame'
import code from '../../../spine/transform/06-quality/project/src/retail/quality.py?raw'
import raw from '../../../spine/transform/06-quality/session.txt?raw'

// The rules as data, applied by silver.checked() — a real run (spine/transform/06): o7 amount
// unreadable, o8 amount not positive, o9 unknown store; 8 pass, 3 quarantined.
export const quality: Scene = transformFrame('quality-quarantine', 6, 'src/retail/quality.py', { code, highlight: [5, 6, 7, 8, 9, 13, 14, 15, 16, 17], terminal: raw }, ['src/retail/quality.py', 'src/retail/silver.py', 'tools/transform/quality_check.py'], {
  id: 'quality-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'reconcile',
      kind: 'table',
      label: '11 events, every one accounted for',
      headers: ['rows', 'go to'],
      values: [
        ['6', 'silver.orders'],
        ['1', 'o4 resent — same row'],
        ['1', 'o6 PENDING — superseded'],
        ['3', 'silver.quarantine'],
      ],
    },
    {
      id: 'quality-facts',
      kind: 'list',
      icon: 'shieldcheck',
      label: 'Rules as data',
      pattern: 'service',
      items: [
        'One list, read in order: the first failure wins',
        'A failing row keeps its reason',
        'Quarantine is a table, not a log line',
        '11 = 6 + 1 + 1 + 3: check it every run',
      ],
    },
  ],
})
