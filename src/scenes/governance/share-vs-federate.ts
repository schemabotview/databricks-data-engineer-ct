import type { Scene } from '@graphlearning/flow'

// §2.7 — three ways to put someone else's data in front of a query. DOCUMENTED, NOT EXECUTED. Cost
// cells name the lever, never a price; cross-region or cross-cloud sharing can add data-egress cost.
export const shareVsFederate: Scene = {
  id: 'share-vs-federate',
  title: 'Copy, share or federate',
  flow: 'TB',
  nodes: [
    {
      id: 'approach-table',
      kind: 'table',
      label: 'Three ways to reach outside data',
      sub: 'copying, access and cost levers',
      headers: ['Approach', 'Copies data?', 'Runs on', 'Freshness'],
      values: [
        ['Ingest', 'yes', 'your compute', 'last load'],
        ['Delta Sharing', 'no', 'recipient compute', 'provider live'],
        ['Federation', 'no', 'source system', 'source live'],
      ],
    },
    {
      id: 'choose-by',
      kind: 'list',
      label: 'Choose by',
      items: [
        'How fresh must it be?',
        'Who pays to read it?',
        'May the data leave its source?',
        'How much load can the source take?',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'approach-table', target: 'choose-by' }],
}
