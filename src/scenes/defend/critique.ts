import type { Scene } from '@graphlearning/flow'
import { defendFrame } from './frame'
import code from '../../../spine/defend/04-latency/project/tools/defend/latency.py?raw'
import raw from '../../../spine/defend/04-latency/session.txt?raw'

// Fresher silver by micro-batches — a real run (spine/defend/04): three batches by a MERGE guarded on
// the source file, plus a replayed batch, equal the full rebuild (8 orders). The critique table cites
// earlier courses' runs (R) and models (M).
export const critique: Scene = defendFrame('defend-critique', 4, 'tools/defend/latency.py', { code, show: [[10, 13], [16, 24]], highlight: [12, 13, 19, 21, 22], terminal: raw }, ['tools/defend/latency.py'], {
  id: 'critique-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'failures',
      kind: 'table',
      label: 'Failures, and what answered them',
      headers: ['failure', 'answered by', 'course'],
      values: [
        ['missing file', 'row-count condition', '10 (M)'],
        ['duplicate, replay', 'MERGE on the key', '8, 10, here'],
        ['out of order', 'sequence guard', '8 (R)'],
        ['lost access', 'run_as, checked early', '10 (M)'],
        ['lost history', 'raw rows in bronze', '8 (R)'],
        ['schema drift', 'nothing yet', '6 (R)'],
      ],
    },
    {
      id: 'critique-facts',
      kind: 'list',
      icon: 'search',
      label: 'The weakest point',
      pattern: 'warn',
      items: [
        'Drift: a fixed schema read "12,50" as 1250.00, silently',
        'No rule here catches a plausible wrong amount',
        'Next: a range check, or a rescued-data column',
      ],
    },
  ],
})
