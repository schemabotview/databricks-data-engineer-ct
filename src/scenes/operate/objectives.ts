import type { Scene } from '@graphlearning/flow'
import { operateFrame } from './frame'
import code from '../../../spine/operate/07-objectives/project/tools/operate/objectives.py?raw'
import raw from '../../../spine/operate/07-objectives/session.txt?raw'

// Two objectives, measured on the sample day (spine/operate/07): 8 of 11 events pass = 72.7% against an
// illustrative 95%; the newest file landed 09:50 (file times set by the step's setup) against a fixed
// 10:20 clock = 30 minutes against an illustrative 15. Both breached.
export const objectives: Scene = operateFrame('operate-objectives', 7, 'tools/operate/objectives.py', { code, show: [[7, 9], [12, 16], [18, 23]], highlight: [7, 8, 13, 19, 20], terminal: raw }, ['tools/operate/objectives.py'], {
  id: 'objectives-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'measured',
      kind: 'table',
      label: 'Objectives (illustrative), measured',
      headers: ['objective', 'target', 'measured'],
      values: [
        ['events passing', '95%', '72.7%'],
        ['freshness', '15 min', '30 min'],
      ],
    },
    {
      id: 'objectives-facts',
      kind: 'list',
      icon: 'gauge',
      label: 'An incident starts with a number',
      pattern: 'warn',
      items: [
        'Agree the objective with the readers first',
        'Measure it every run, from the data itself',
        'A breach is the alert, even when the run succeeded',
        'Then: who is told, who fixes, by when (§10)',
        'File times here were set for the example',
      ],
    },
  ],
})
