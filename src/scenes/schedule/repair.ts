import type { Scene } from '@graphlearning/flow'
import { scheduleFrame } from './frame'
import code from '../../../spine/schedule/05-repair/project/tools/schedule/repair.py?raw'
import raw from '../../../spine/schedule/05-repair/session.txt?raw'

// Repair, a full rerun and a retry after a committed write — a MODEL of the documented semantics with
// real Delta effects (spine/schedule/05): repair keeps ingest (bronze 8, 1 row of 160.00); a full rerun
// appends bronze to 16 (merge: 8); a retried publish leaves 2 rows (merge: 1).
export const repair: Scene = scheduleFrame('job-repair', 5, 'tools/schedule/repair.py', { code, show: [[7, 9], [15, 18], [22, 24]], highlight: [9, 16, 18, 23, 24], terminal: raw }, ['tools/schedule/repair.py'], {
  id: 'repair-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'outcomes',
      kind: 'table',
      label: 'The same failure, three ways back',
      headers: ['', 'append', 'MERGE'],
      values: [
        ['repair: bronze', '8', '8'],
        ['full rerun: bronze', '16', '8'],
        ['retried publish: rows', '2', '1'],
      ],
    },
    {
      id: 'repair-facts',
      kind: 'list',
      icon: 'repeat',
      label: 'Jobs does not make a task idempotent',
      pattern: 'warn',
      items: [
        'A repair runs only what failed or was skipped',
        'A full rerun runs everything again, ingest too',
        'A retry after a committed write writes it twice',
        'Silver hid bronze’s 16 with DISTINCT: luck, not design',
        'Make every write a MERGE or an overwrite on a key',
      ],
    },
  ],
})
