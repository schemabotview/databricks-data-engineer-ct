import type { Scene } from '@graphlearning/flow'

// §4.9 — the first bronze table, its counts, and what a replay does to them. LOCAL RUN. The
// `ingested_at` column is a DESIGN choice and was not part of the run; the other counts are asserted in
// scripts/verify/ch04_ingestion.py.
export const bronzeWalkthrough: Scene = {
  id: 'bronze-walkthrough',
  title: 'Source to bronze, counted',
  flow: 'TB',
  nodes: [
    {
      id: 'bronze-counts',
      kind: 'table',
      label: 'From three files to bronze',
      sub: 'local run',
      headers: ['Measure', 'Count'],
      values: [
        ['rows in file a', '3'],
        ['rows in file b', '3'],
        ['rows in file c', '2'],
        ['bronze rows', '8'],
        ['distinct order_id', '7'],
        ['after a full replay, no dedupe', '16'],
      ],
    },
    {
      id: 'bronze-shape',
      kind: 'code',
      filename: 'retail.bronze.orders  (design)',
      label: `order_id, store_id, amount, status
                      (all text, as sent)
source_file   <- _metadata.file_name
ingested_at   <- current_timestamp()`,
    },
  ],
  edges: [{ source: 'bronze-counts', target: 'bronze-shape' }],
}
