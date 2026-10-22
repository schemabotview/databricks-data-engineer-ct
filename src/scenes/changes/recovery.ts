import type { Scene } from '@graphlearning/flow'
import { changesFrame } from './frame'
import code from '../../../spine/changes/10-recovery/project/tools/changes/recovery.py?raw'
import raw from '../../../spine/changes/10-recovery/session.txt?raw'

// §9's table vacuumed to zero hours: its change feed is gone, the table still reads, and a rebuild
// from the source's records equals it — a real run (spine/changes/10).
export const recovery: Scene = changesFrame('worked-recovery', 10, 'tools/changes/recovery.py', { code, show: [[10, 25]], highlight: [11, 13, 21, 22, 23], terminal: raw }, ['tools/changes/recovery.py'], {
  id: 'recovery-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'survives',
      kind: 'table',
      label: 'After VACUUM, what is left',
      headers: ['', 'still there?'],
      values: [
        ['the table now', 'yes'],
        ['old versions, change feed', 'no: vacuumed'],
        ['the source’s records', 'while it keeps them'],
        ['a rebuild from them', 'equals the table'],
      ],
    },
    {
      id: 'recovery-facts',
      kind: 'list',
      icon: 'shieldcheck',
      label: 'What recovery needs',
      pattern: 'service',
      items: [
        'Duplicates: an idempotent sink (§6)',
        'Out-of-order changes: a sequence guard (§7)',
        'Lost history: the raw records, kept in bronze',
        'A rebuild is only possible from what was kept',
        'Retention is a recovery decision, not only a cost one',
      ],
    },
  ],
})
