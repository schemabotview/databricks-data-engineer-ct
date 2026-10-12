import type { Scene } from '@graphlearning/flow'

// §7.6 — AUTO CDC into a streaming table. DOCUMENTED, NOT RUN. Clause names follow the current docs as
// checked through search summaries (CREATE FLOW ... AS AUTO CDC INTO, KEYS, SEQUENCE BY, STORED AS SCD
// TYPE 1|2; SCD 2 adds __START_AT and __END_AT). Using a STRUCT in SEQUENCE BY to break ties is
// documented but must be re-verified. The result table is ILLUSTRATIVE, built from the Chapter 5 events
// for o6; it was NOT produced by AUTO CDC.
export const autoCdcSequence: Scene = {
  id: 'auto-cdc-sequence',
  title: 'AUTO CDC: keys, sequence, history',
  flow: 'TB',
  nodes: [
    {
      id: 'autocdc-code',
      kind: 'code',
      filename: 'silver.sql  (documented, not run)',
      label: `CREATE OR REFRESH STREAMING TABLE silver_orders;

CREATE FLOW orders_cdc AS AUTO CDC INTO silver_orders
FROM STREAM(typed_orders)
KEYS (order_id)
SEQUENCE BY STRUCT(event_ts, source_file)
STORED AS SCD TYPE 2;`,
    },
    {
      id: 'scd2-illustration',
      kind: 'table',
      label: 'Illustrative SCD type 2 rows for o6',
      sub: 'shaped like the documented output, not run',
      headers: ['order', 'status', '__START_AT', '__END_AT'],
      values: [
        ['o6', 'PENDING', '09:23', '09:41'],
        ['o6', 'COMPLETED', '09:41', 'NULL'],
      ],
    },
    {
      id: 'autocdc-notes',
      kind: 'list',
      label: 'What you declare',
      items: ['KEYS: which row', 'SEQUENCE BY: which is newer', 'a STRUCT breaks ties', 'SCD type 1 or 2'],
      framed: true,
    },
  ],
  edges: [
    { source: 'autocdc-code', target: 'scd2-illustration' },
    { source: 'scd2-illustration', target: 'autocdc-notes' },
  ],
}
