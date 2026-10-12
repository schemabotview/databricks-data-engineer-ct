import type { Scene } from '@graphlearning/flow'

// §6.9 — the source's 8 CDC records against the 9 rows the target table's change feed recorded after the
// sequence-guarded apply. LOCAL RUN. This is a CONFIGURED feed (delta.enableChangeDataFeed = true). An
// automatic feed on an eligible Databricks table was NOT tested and is not claimed.
export const cdfVsCdc: Scene = {
  id: 'cdf-vs-cdc',
  title: 'What the source sent, what the table recorded',
  flow: 'TB',
  nodes: [
    {
      id: 'feed-compare',
      kind: 'table',
      label: 'Source records vs table change feed',
      sub: 'configured feed, local run',
      headers: ['Arrival batch', 'Source sent', 'Table feed rows'],
      values: [
        ['1', '3 records', '3 inserts'],
        ['2', '3 records', '6 (3 pre, 3 post)'],
        ['3', '2 late records', '0'],
        ['total', '8', '9'],
      ],
    },
    {
      id: 'feed-difference',
      kind: 'list',
      label: 'Different questions',
      items: [
        'CDC: what the source did, in its order',
        'Feed: what this table changed, per commit',
        'ignored late records leave no feed row',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'feed-compare', target: 'feed-difference' }],
}
