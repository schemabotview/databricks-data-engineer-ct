import type { Scene } from '@graphlearning/flow'
import { defendFrame } from './frame'
import code from '../../../spine/defend/02-requirements/project/src/retail/partner.py?raw'
import raw from '../../../spine/defend/02-requirements/session.txt?raw'

// Two changed requirements through the project's own modules — a real run (spine/defend/02): base
// 170.00; a correction (orders-e.csv, o4 → 18.00) 173.00 with silver still 6; a partner source keyed by
// store code (src/retail/partner.py) 215.00, silver 8, p3's unknown code quarantined; 15 = 8 + 3 + 4.
export const requirements: Scene = defendFrame('defend-requirements', 2, 'src/retail/partner.py', { code, show: [[11, 25]], highlight: [14, 15, 19, 20, 21, 22] , terminal: raw }, ['src/retail/partner.py', 'tools/defend'], {
  id: 'requirements-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'changes',
      kind: 'table',
      label: 'Gold, as the requirements changed',
      headers: ['', 'silver', 'gold'],
      values: [
        ['base: files a–d', '6', '170.00'],
        ['o4 corrected to 18.00', '6', '173.00'],
        ['+ partner orders', '8', '215.00'],
      ],
    },
    {
      id: 'requirements-facts',
      kind: 'list',
      icon: 'gitbranch',
      label: 'What the design had to change',
      pattern: 'service',
      items: [
        'A correction: nothing; the newest file already wins',
        'A new source: one module, mapping codes to store ids',
        'An unknown code becomes NULL, and the rules catch it',
        '15 = 8 silver + 3 older versions + 4 quarantined',
      ],
    },
  ],
})
