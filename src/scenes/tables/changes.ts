import type { Scene } from '@graphlearning/flow'
import { labFrame } from './frame'
import code from '../../../spine/tables/04-changes/project/tools/delta/changes.py?raw'
import raw from '../../../spine/tables/04-changes/session.txt?raw'

// Versions 3–5 of the Course 5 timeline (UPDATE o6, DELETE o3, MERGE o8 + o9), and the duplicate-source
// MERGE that Delta refuses — a real run (spine/tables/04).
export const changes: Scene = labFrame('dml-merge', 4, code, raw, { show: [[7, 22]], highlight: [7, 8, 9, 11, 12, 13, 16, 17, 18, 22] }, {
  id: 'changes-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'merge-rules',
      kind: 'table',
      label: 'MERGE, clause by clause',
      headers: ['clause', 'here'],
      values: [
        ['ON', 'same order_id'],
        ['WHEN MATCHED', 'o8: status updated'],
        ['WHEN NOT MATCHED', 'o9: inserted'],
        ['two matches', 'refused, not guessed'],
      ],
    },
    {
      id: 'changes-facts',
      kind: 'list',
      icon: 'layers',
      label: 'Changing rows in files',
      pattern: 'storage',
      items: [
        'Files are rewritten, never edited in place',
        'UPDATE and DELETE: remove old files, add new',
        'One MERGE is one commit: all of it or none',
        'Make the source unique before you MERGE',
      ],
    },
  ],
})
