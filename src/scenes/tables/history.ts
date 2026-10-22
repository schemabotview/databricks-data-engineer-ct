import type { Scene } from '@graphlearning/flow'
import { labFrame } from './frame'
import code from '../../../spine/tables/05-history/project/tools/delta/history.py?raw'
import raw from '../../../spine/tables/05-history/session.txt?raw'

// DESCRIBE HISTORY, VERSION AS OF and RESTORE on the same timeline — a real run (spine/tables/05):
// six versions, o6 PENDING at version 2, RESTORE to 4 writes version 6 with 6 rows, version 5 still 7.
export const history: Scene = labFrame('history-restore', 5, code, raw, { show: [[4, 19]], highlight: [6, 9, 14, 18] }, {
  id: 'history-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'three-things',
      kind: 'table',
      label: 'Three different things',
      headers: ['command', 'does'],
      values: [
        ['DESCRIBE HISTORY', 'lists the commits'],
        ['VERSION AS OF n', 'reads an old list'],
        ['RESTORE TO n', 'writes a NEW version'],
      ],
    },
    {
      id: 'history-facts',
      kind: 'list',
      icon: 'history',
      label: 'Restore moves forward',
      pattern: 'network',
      items: [
        'RESTORE does not delete versions after n',
        'Version 5 is still readable after the restore',
        'So a restore can itself be undone',
        'History lasts only as long as its files — next',
      ],
    },
  ],
})
