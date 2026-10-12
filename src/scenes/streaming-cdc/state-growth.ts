import type { Scene } from '@graphlearning/flow'

// §6.3 — state rows held after each batch, for a windowed sum and for a deduplication, each with and
// without a watermark. LOCAL RUN over the same four files; batch 4 exists only when a watermark is set
// (an extra batch that advances it). `-` means no such batch.
export const stateGrowth: Scene = {
  id: 'state-growth',
  title: 'State rows, with and without a watermark',
  flow: 'TB',
  nodes: [
    {
      id: 'state-table',
      kind: 'table',
      label: 'State rows after each batch',
      sub: 'local run',
      headers: ['Batch', 'Sum, none', 'Sum, wm', 'Dedup, none', 'Dedup, wm'],
      values: [
        ['0', '2', '2', '3', '3'],
        ['1', '3', '3', '5', '3'],
        ['2', '4', '3', '7', '4'],
        ['3', '5', '3', '9', '3'],
        ['4', '-', '2', '-', '1'],
      ],
    },
    {
      id: 'dedup-code',
      kind: 'code',
      filename: 'dedup.py',
      label: `(source.withWatermark("event_ts", "10 minutes")
  .dropDuplicates(["order_id", "event_ts"]))`,
    },
    {
      id: 'bounded-list',
      kind: 'list',
      label: 'Bounded or not',
      items: ['no watermark: state only grows', 'watermark: closed windows leave', 'a dedup key without time never expires'],
      framed: true,
    },
  ],
  edges: [
    { source: 'state-table', target: 'dedup-code' },
    { source: 'dedup-code', target: 'bounded-list' },
  ],
}
