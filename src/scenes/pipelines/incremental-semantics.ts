import type { Scene } from '@graphlearning/flow'

// §7.5 — what is read on each update, and what a streaming read does when its source changes. The
// streaming-table row is the LOCAL ANALOGUE from Chapter 4 (3, 3, 0, 2 rows read); how a materialized
// view refreshes is DOCUMENTED, NOT RUN (incrementally when possible, otherwise a recompute). The error
// card is real output from a local Delta streaming read, trimmed.
export const incrementalSemantics: Scene = {
  id: 'incremental-semantics',
  title: 'Incremental reads and a changing source',
  flow: 'TB',
  nodes: [
    {
      id: 'update-table',
      kind: 'table',
      label: 'Four updates, new files each time',
      sub: 'streaming read: local analogue; view: documented',
      headers: ['Update', 'New rows', 'Stream reads', 'Mat. view'],
      values: [
        ['1', '3', '3', 'computes'],
        ['2', '3', '3', 'incremental or full'],
        ['3', '0', '0', 'nothing new'],
        ['4', '2', '2', 'incremental or full'],
      ],
    },
    {
      id: 'source-update-error',
      kind: 'code',
      filename: 'a source UPDATE  (local run, trimmed)',
      label: `DELTA_SOURCE_TABLE_IGNORE_CHANGES
Detected a data update in the source
table at version 1. This is currently
not supported. ... set the option
'skipChangeCommits' to 'true'.`,
    },
  ],
  edges: [{ source: 'update-table', target: 'source-update-error' }],
}
