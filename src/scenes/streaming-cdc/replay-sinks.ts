import type { Scene } from '@graphlearning/flow'

// §6.6 — a crash after a foreachBatch wrote batch 2 but before Spark committed it. LOCAL RUN. On restart
// the batch is replayed: the plain append sink gains copies, the MERGE sink does not. 10 source rows, 9
// distinct (o4 was resent by the source itself).
export const replaySinks: Scene = {
  id: 'replay-sinks',
  title: 'Replayed batches and two kinds of sink',
  flow: 'TB',
  nodes: [
    {
      id: 'sink-table',
      kind: 'table',
      label: 'Rows in each sink',
      sub: 'crash after batch 2 is written',
      headers: ['Moment', 'Append sink', 'MERGE sink'],
      values: [
        ['after the crash', '8', '7'],
        ['after the restart', '12', '9'],
      ],
    },
    {
      id: 'idempotent-write',
      kind: 'code',
      filename: 'write_batch.py',
      label: `def write_batch(df, batch_id):
  (DeltaTable.forPath(spark, SINK).alias("t")
    .merge(df.dropDuplicates(KEY).alias("s"),
           ON_KEY)
    .whenNotMatchedInsertAll()
    .execute())`,
    },
    {
      id: 'at-least-once',
      kind: 'list',
      label: 'Why a batch can run twice',
      items: ['committed after the function returns', 'a crash in between replays it', 'an idempotent write absorbs it'],
      framed: true,
    },
  ],
  edges: [
    { source: 'sink-table', target: 'idempotent-write' },
    { source: 'idempotent-write', target: 'at-least-once' },
  ],
}
