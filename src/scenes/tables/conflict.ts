import type { Scene } from '@graphlearning/flow'
import { labFrame } from './frame'
import code from '../../../spine/tables/02-conflict/project/tools/delta/conflict.py?raw'
import raw from '../../../spine/tables/02-conflict/session.txt?raw'

// Two real concurrent UPDATEs (spine/tables/02, volatile: it is a race, timed with a 2 s UDF). B
// commits; A is refused with DELTA_CONCURRENT_APPEND and o1 ends 41.00 COMPLETED — the frozen fact.
export const conflict: Scene = labFrame('write-conflict', 2, code, raw, { show: [[19, 34]], highlight: [22, 25, 28, 29, 30, 31, 32, 33] }, {
  id: 'conflict-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'timeline',
      kind: 'table',
      label: 'What happened, in order',
      headers: ['t', 'writer A', 'writer B'],
      values: [
        ['0 s', 'reads version 1', ''],
        ['1 s', 'still reading o1', 'reads version 1'],
        ['1 s', '', 'commits version 2'],
        ['2 s', 'tries version 2: taken', ''],
        ['', 'refused, nothing written', ''],
      ],
    },
    {
      id: 'conflict-facts',
      kind: 'list',
      icon: 'shieldcheck',
      label: 'ACID, and its scope',
      pattern: 'service',
      items: [
        'Atomic: A wrote nothing, not half of its change',
        'Isolated: A never saw B’s row, and lost',
        'One table, one commit: no multi-table transaction',
        'A refused writer must retry, from the new version',
      ],
    },
  ],
}, ['conf', 'data', 'governance', 'notebooks'])
