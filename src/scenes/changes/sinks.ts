import type { Scene } from '@graphlearning/flow'
import { changesFrame } from './frame'
import code from '../../../spine/changes/06-sinks/project/tools/changes/sinks.py?raw'
import raw from '../../../spine/changes/06-sinks/session.txt?raw'

// foreachBatch writing one batch to an append sink and a MERGE sink, crashing after batch 2 is
// written but before it is committed — a real run (spine/changes/06): 8 / 7 rows, then 12 / 9.
export const sinks: Scene = changesFrame('sinks-idempotency', 6, 'tools/changes/sinks.py', { code, show: [[13, 22], [40, 41]], highlight: [15, 17, 18, 19, 21, 22], terminal: raw }, ['tools/changes/sinks.py'], {
  id: 'sinks-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'replayed',
      kind: 'table',
      label: 'Ten events, batch 2 written twice',
      headers: ['sink', 'after crash', 'after restart'],
      values: [
        ['append', '8', '12'],
        ['MERGE on the key', '7', '9'],
      ],
    },
    {
      id: 'sink-facts',
      kind: 'list',
      icon: 'shieldcheck',
      label: 'At least once, made exactly once',
      pattern: 'service',
      items: [
        'A batch is committed only after its write returns',
        'A crash in between runs the same batch again',
        'An append writes it twice; a MERGE on the key does not',
        'The MERGE also drops o4’s resend: 9 unique events',
        'Idempotency is the sink’s job, not the checkpoint’s',
      ],
    },
  ],
})
