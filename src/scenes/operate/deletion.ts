import type { Scene } from '@graphlearning/flow'
import { operateFrame } from './frame'
import code from '../../../spine/operate/08-deletion/project/tools/operate/deletion.py?raw'
import raw from '../../../spine/operate/08-deletion/session.txt?raw'

// A customer's rows deleted — a real run (spine/operate/08): after DELETE, version 1 and the change
// feed still hold c1's two rows and the derived total still says 100.00; after VACUUM the old version and
// the feed are gone, the derived table is not; a recompute makes it 35.00.
export const deletion: Scene = operateFrame('operate-deletion', 8, 'tools/operate/deletion.py', { code, show: [[17, 24], [36, 41]], highlight: [19, 21, 23, 36, 39, 40, 41], terminal: raw }, ['tools/operate/deletion.py'], {
  id: 'deletion-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'still-there',
      kind: 'table',
      label: 'Where c1 still is',
      headers: ['place', 'after DELETE', 'after VACUUM'],
      values: [
        ['the table', 'gone', 'gone'],
        ['version 1', '2 rows', 'unreadable'],
        ['change feed', '2 rows', 'unreadable'],
        ['a derived total', '100.00', '100.00 until rebuilt'],
      ],
    },
    {
      id: 'deletion-facts',
      kind: 'list',
      icon: 'trash',
      label: 'Recovery and deletion pull apart',
      pattern: 'warn',
      items: [
        'A DELETE is a new version: the old ones keep the data',
        'VACUUM ends it for the table, not for what was derived',
        'Every downstream copy needs its own recompute',
        'Retention long enough to recover, short enough to forget',
        'A backfill can replay only what the source still keeps',
      ],
    },
  ],
})
