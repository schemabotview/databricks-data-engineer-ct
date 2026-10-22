import type { Scene } from '@graphlearning/flow'
import { changesFrame } from './frame'
import code from '../../../spine/changes/02-watermarks/project/tools/changes/watermarks.py?raw'
import raw from '../../../spine/changes/02-watermarks/session.txt?raw'

// Ten-minute windows, a ten-minute watermark, one file per batch — a real run (spine/changes/02):
// watermarks none / 09:04 / 09:13 / 09:21 / 09:34; 09:00 = 95.00 (o10 counted, o12 dropped), 09:10 =
// 110.00 (the resend counted twice), 09:20 = 10.00.
export const watermarks: Scene = changesFrame('event-time-watermarks', 2, 'tools/changes/watermarks.py', { code, show: [[8, 12], [16, 25]], highlight: [10, 11, 16, 22], terminal: raw }, ['tools/changes/watermarks.py'], {
  id: 'watermarks-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'arrivals',
      kind: 'table',
      label: 'Two late events, two outcomes',
      headers: ['event', 'time', 'arrives', 'outcome'],
      values: [
        ['o10', '09:06', 'batch 2', 'counted in 09:00'],
        ['o12', '09:02', 'batch 3', 'dropped'],
        ['o4 again', '09:14', 'batch 1', 'counted twice'],
      ],
    },
    {
      id: 'watermark-facts',
      kind: 'list',
      icon: 'history',
      label: 'Event time, not arrival time',
      pattern: 'service',
      items: [
        'Watermark = latest event time seen, minus 10 minutes',
        'A window is written once the watermark passes its end',
        'An event whose window has closed is dropped, silently',
        'A longer wait catches more, and writes later',
        'A watermark does not deduplicate: §3 does',
      ],
    },
  ],
})
