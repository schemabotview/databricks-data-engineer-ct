import type { Scene } from '@graphlearning/flow'

// §4.6 — keeping the raw line of an unreadable record, and reconciling counts. LOCAL RUN with Spark's
// PERMISSIVE mode and columnNameOfCorruptRecord. Databricks' `_rescued_data` column is DOCUMENTED, not
// run, and works differently: it collects unexpected or mismatched fields.
export const rescuedQuarantine: Scene = {
  id: 'rescued-quarantine',
  title: 'Keep what you could not read',
  flow: 'TB',
  nodes: [
    {
      id: 'permissive-code',
      kind: 'code',
      filename: 'parse.py',
      label: `typed = ("order_id string, store_id int,"
  " amount decimal(10,2), status string,"
  " _bad_record string")
(spark.read.option("header", True)
  .option("mode", "PERMISSIVE")
  .option("columnNameOfCorruptRecord",
          "_bad_record")
  .schema(typed).csv(LAND))`,
    },
    {
      id: 'bad-row-table',
      kind: 'table',
      label: 'The flagged row',
      sub: 'local run',
      headers: ['order_id', 'amount', '_bad_record'],
      values: [['o7', 'NULL', 'o7,9,n/a,COMPLETED']],
    },
    {
      id: 'ingest-reconcile',
      kind: 'table',
      label: 'Reconciliation',
      sub: '8 = 7 + 1',
      headers: ['Rows', 'Count'],
      values: [
        ['read', '8'],
        ['parsed', '7'],
        ['flagged', '1'],
      ],
    },
  ],
  edges: [
    { source: 'permissive-code', target: 'bad-row-table' },
    { source: 'bad-row-table', target: 'ingest-reconcile' },
  ],
}
