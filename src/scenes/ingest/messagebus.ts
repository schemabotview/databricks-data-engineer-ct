import type { Scene } from '@graphlearning/flow'

// Kafka as a streaming source, DOCUMENTED: Spark's Kafka source options (subscribe, startingOffsets,
// kafka.bootstrap.servers) are Apache Spark's, from spark.apache.org/docs/4.0.1; the broker and topic
// are fictional, and nothing here is run (no broker in the authoring environment).
const KAFKA = [
  '# documented, not run: there is no broker here',
  'events = (spark.readStream.format("kafka")',
  '    .option("kafka.bootstrap.servers", "broker:9092")',
  '    .option("subscribe", "store-orders")',
  '    .option("startingOffsets", "earliest")',
  '    .load())',
  '',
  'orders = events.selectExpr(',
  '    "CAST(value AS STRING) AS json",',
  '    "topic", "partition", "offset", "timestamp")',
  '',
  '(orders.writeStream',
  '    .option("checkpointLocation", "checkpoints/kafka_orders")',
  '    .toTable("bronze.order_events"))',
].join('\n')

export const messagebus: Scene = {
  id: 'message-bus',
  framed: true,
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  nodes: [
    { id: 'kafka-code', kind: 'code', filename: 'bronze_events.py — documented', label: KAFKA },
    {
      id: 'right',
      label: 'Offsets',
      bare: true,
      children: [
        {
          id: 'files-vs-bus',
          kind: 'table',
          label: 'Files against a message bus',
          headers: ['', 'landed files', 'a topic'],
          values: [
            ['unit of progress', 'a file', 'an offset per partition'],
            ['kept by the source', 'until deleted', 'its retention period'],
            ['restart from', 'the checkpoint', 'the checkpoint’s offsets'],
            ['replay', 'files still there', 'only within retention'],
          ],
        },
        {
          id: 'assumptions',
          kind: 'list',
          icon: 'waves',
          label: 'What the stream assumes',
          pattern: 'warn',
          items: [
            'The checkpoint’s offsets are still in the topic',
            'A job down longer than retention loses events',
            'The same event can arrive twice: keep the offset',
            'Order holds within a partition, not across them',
          ],
        },
      ],
    },
  ],
  edges: [],
}
