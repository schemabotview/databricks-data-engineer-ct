import type { Scene } from '@graphlearning/flow'

// §3.7 — the table change feed of a small table, and its limits. LOCAL RUN with the CONFIGURED feed
// (delta.enableChangeDataFeed = true). Whether Databricks provides a feed automatically for an eligible
// table is a platform behaviour NOT shown here; check the current docs before relying on it.
export const changeFeed: Scene = {
  id: 'change-feed',
  title: 'What the change feed records',
  flow: 'TB',
  nodes: [
    {
      id: 'feed-code',
      kind: 'code',
      filename: 'feed.py',
      label: `spark.read.format("delta")
  .option("readChangeFeed", "true")
  .option("startingVersion", 1)
  .table("feed")`,
    },
    {
      id: 'feed-table',
      kind: 'table',
      label: 'Changes to feed',
      sub: 'insert, update, delete',
      headers: ['order', 'status', '_change_type', 'ver'],
      values: [
        ['o1', 'PENDING', 'insert', '1'],
        ['o2', 'PENDING', 'insert', '1'],
        ['o1', 'PENDING', 'update_preimage', '2'],
        ['o1', 'COMPLETED', 'update_postimage', '2'],
        ['o2', 'PENDING', 'delete', '3'],
      ],
    },
    {
      id: 'feed-limits',
      kind: 'list',
      label: 'Not an archive',
      items: [
        'records only from enabling onward',
        'kept in _change_data, under retention',
        'differs from source-system CDC',
      ],
      framed: true,
    },
  ],
  edges: [
    { source: 'feed-code', target: 'feed-table' },
    { source: 'feed-table', target: 'feed-limits' },
  ],
}
