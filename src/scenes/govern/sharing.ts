import type { Scene, SceneNode } from '@graphlearning/flow'

// Three ways to put someone else's data in front of a query (DOCUMENTED: ingestion, Delta Sharing and
// Lakehouse Federation, via search summaries). Cost cells name the lever, never a price.
const way = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern'], items: string[]): SceneNode =>
  ({ id, kind: 'list', label, sub, icon, pattern, items })

export const sharing: Scene = {
  id: 'share-federate',
  framed: true,
  padding: 0.04,
  nodes: [
    {
      id: 'ways',
      label: 'A partner’s orders, three ways in (documented, not run)',
      bare: true,
      cols: 3,
      align: 'start',
      stretch: true,
      children: [
        way('ingest', 'Ingest', 'copy it into bronze', 'copy', 'service', [
          'A copy you own, governed like any table',
          'As fresh as the last load',
          'You pay to store it and to load it',
          'Courses 6 and 7 build exactly this',
        ]),
        way('share', 'Delta Sharing', 'the provider grants you their table', 'share', 'network', [
          'No copy: you read the provider’s files',
          'As fresh as the provider’s last commit',
          'Your compute reads; the provider stores',
          'Read-only, revocable by the provider',
        ]),
        way('federate', 'Lakehouse Federation', 'query their database where it lives', 'globe', 'user', [
          'No copy: the query runs on their system',
          'As fresh as the source, every time',
          'Every query loads the source system',
          'Good for a look, risky for a nightly job',
        ]),
      ],
    },
    {
      id: 'below',
      label: 'Choosing',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'compare',
          kind: 'table',
          label: 'The trade',
          headers: ['', 'ingest', 'share', 'federate'],
          values: [
            ['copies the data', 'yes', 'no', 'no'],
            ['freshness', 'last load', 'provider live', 'source live'],
            ['who runs the read', 'your compute', 'your compute', 'the source'],
            ['governed in', 'your catalog', 'your catalog', 'your catalog'],
          ],
        },
        {
          id: 'choose',
          kind: 'list',
          icon: 'scale',
          label: 'Ask first',
          pattern: 'warn',
          items: [
            'How fresh must it be?',
            'Who pays to read it?',
            'May the data leave its source?',
            'How much load can the source take?',
          ],
        },
      ],
    },
  ],
  edges: [],
}
