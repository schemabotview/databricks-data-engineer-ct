import type { Scene } from '@graphlearning/flow'

// §6.2 — the event and state timeline of a windowed sum, batch by batch. LOCAL RUN: ten order events in
// four files, 10-minute windows, a 10-minute watermark, append mode, one file per batch. The watermark
// shown is the value in force during that batch. o12 (event time 09:02) is dropped as too late in batch 3.
export const watermarkTimeline: Scene = {
  id: 'watermark-timeline',
  title: 'Batch by batch: watermark and emitted windows',
  flow: 'TB',
  nodes: [
    {
      id: 'watermark-table',
      kind: 'table',
      label: 'Append mode, 10-minute watermark',
      sub: 'local run',
      headers: ['Batch', 'New file', 'Watermark', 'Emitted'],
      values: [
        ['0', 'f1', 'none yet', '-'],
        ['1', 'f2', '09:04', '-'],
        ['2', 'f3', '09:13', '09:00 = 95.00'],
        ['3', 'f4', '09:21', '09:10 = 110.00'],
        ['4', 'none', '09:34', '09:20 = 10.00'],
      ],
    },
    {
      id: 'late-events',
      kind: 'list',
      label: 'The two late events',
      items: [
        'o10 (09:06): counted, window still open',
        'o12 (09:02): dropped in batch 3',
        'no watermark: o12 counted, 100.00',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'watermark-table', target: 'late-events' }],
}
