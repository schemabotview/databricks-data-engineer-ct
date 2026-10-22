import type { Scene } from '@graphlearning/flow'
import { ingestFrame } from './frame'
import code from '../../../spine/ingest/04-arrival/project/src/retail/bronze.py?raw'
import raw from '../../../spine/ingest/04-arrival/session.txt?raw'

// src/retail/bronze.py with Spark's file source and a checkpoint, driven by tools/ingest/arrival.py —
// a real run (spine/ingest/04): 3, 6, 6, 8, then 16 once the checkpoint is deleted (CLAUDE.md, Course 6).
export const arrival: Scene = ingestFrame('file-progress', 4, 'src/retail/bronze.py', { code, show: [[5, 21]], highlight: [6, 14, 16, 17, 18, 19], terminal: raw }, ['src/retail/bronze.py', 'tools/ingest/arrival.py'], {
  id: 'arrival-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'timeline',
      kind: 'table',
      label: 'Five runs of ingest()',
      headers: ['landed', 'read', 'bronze'],
      values: [
        ['orders-a.csv', '3 rows', '3'],
        ['orders-b.csv', '3 rows', '6'],
        ['nothing', '0 rows', '6'],
        ['orders-c.csv', '2 rows', '8'],
        ['(checkpoint lost)', 'all 8 again', '16'],
      ],
    },
    {
      id: 'arrival-facts',
      kind: 'list',
      icon: 'history',
      label: 'The checkpoint is the memory',
      pattern: 'network',
      items: [
        'It records which files were read, per run',
        'It belongs to ONE query writing ONE table',
        'Lose it, and every file is new again',
        'availableNow: read what is there, then stop',
      ],
    },
  ],
})
