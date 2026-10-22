import type { Scene } from '@graphlearning/flow'
import { labFrame } from './frame'
import code from '../../../spine/tables/06-vacuum/project/tools/delta/vacuum.py?raw'
import raw from '../../../spine/tables/06-vacuum/session.txt?raw'

// VACUUM on a three-version table — a real run (spine/tables/06, volatile: which task fails first is
// a race). The safety check refuses RETAIN 0 HOURS; the lesson turns it off and says not to.
export const vacuum: Scene = labFrame('vacuum', 6, code, raw, { show: [[21, 36]], highlight: [22, 24, 26, 27, 28, 31, 32, 34, 36] }, {
  id: 'vacuum-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'readable',
      kind: 'table',
      label: 'Readable, before and after',
      headers: ['version', 'before', 'after VACUUM'],
      values: [
        ['1: [1, 2]', 'yes', 'no — file gone'],
        ['2: [1, 2, 3]', 'yes', 'no — file gone'],
        ['3: [2, 3]', 'yes', 'yes'],
      ],
    },
    {
      id: 'vacuum-facts',
      kind: 'list',
      icon: 'trash',
      label: 'The retention trade',
      pattern: 'warn',
      items: [
        'Default: keep files 7 days (168 hours)',
        'Shorter saves storage, ends time travel sooner',
        'A long query reading old files can fail',
        'Never RETAIN 0 HOURS on a table in use',
      ],
    },
  ],
})
