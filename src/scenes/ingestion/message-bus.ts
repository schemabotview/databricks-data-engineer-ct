import type { Scene } from '@graphlearning/flow'

// §4.8 — replay position and retention for three kinds of source. DOCUMENTED, NOT RUN: no message
// broker was available. The Kafka read is the standard Structured Streaming shape; broker settings are
// placeholders.
export const messageBus: Scene = {
  id: 'message-bus',
  title: 'Offsets: where to resume',
  flow: 'TB',
  nodes: [
    {
      id: 'offset-table',
      kind: 'table',
      label: 'Resume position by source',
      sub: 'documented, not run',
      headers: ['Source', 'Position', 'Replay needs'],
      values: [
        ['Files', 'files seen', 'files kept'],
        ['Message bus', 'partition offsets', 'topic retention'],
        ['Database log', 'log position', 'log retention'],
      ],
    },
    {
      id: 'kafka-code',
      kind: 'code',
      filename: 'bus.py  (documented, not run)',
      label: `(spark.readStream.format("kafka")
  .option("kafka.bootstrap.servers", SERVERS)
  .option("subscribe", "orders")
  .option("startingOffsets", "earliest")
  .load())`,
    },
    {
      id: 'bus-assumptions',
      kind: 'list',
      label: 'Operational assumptions',
      items: [
        'offsets live in your checkpoint',
        'expired data cannot be replayed',
        'guarantees depend on source and sink',
      ],
      framed: true,
    },
  ],
  edges: [
    { source: 'offset-table', target: 'kafka-code' },
    { source: 'kafka-code', target: 'bus-assumptions' },
  ],
}
