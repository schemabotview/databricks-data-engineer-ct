import type { Scene } from '@graphlearning/flow'

// §6.4 — a stream-stream join bounded by a time condition and watermarks, and a stream-static join.
// LOCAL RUN. The resent o4 matches its payment twice; o10's payment is 24 minutes after the order, outside
// the 15-minute bound, so it never matches and the outer join emits it with NULL only after the watermark
// passes (batch 4).
export const streamJoins: Scene = {
  id: 'stream-joins',
  title: 'Joining streams with bounded state',
  flow: 'TB',
  nodes: [
    {
      id: 'join-code',
      kind: 'code',
      filename: 'join.py',
      label: `cond = F.expr(
  "p_order = order_id AND "
  "pay_ts >= event_ts AND "
  "pay_ts <= event_ts + interval 15 minutes")`,
    },
    {
      id: 'join-output',
      kind: 'table',
      label: 'Inner join, by batch',
      sub: 'append mode, local run',
      headers: ['Batch', 'Matched pairs'],
      values: [
        ['0', 'o1, o2'],
        ['1', 'o4, o4, o5'],
        ['2', 'o11'],
        ['3', 'o13'],
        ['4', 'none (outer: o10, NULL)'],
      ],
    },
  ],
  edges: [{ source: 'join-code', target: 'join-output' }],
}
