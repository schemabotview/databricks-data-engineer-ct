import type { Scene } from '@graphlearning/flow'

// §4.7 — who does what when ingestion is code you write versus a managed connector. DOCUMENTED, NOT
// RUN, and deliberately generic: which sources a managed connector supports, and its limits, vary by
// connector and must be read from the current docs.
export const connectorMatrix: Scene = {
  id: 'connector-matrix',
  title: 'Your code or a managed connector',
  flow: 'TB',
  nodes: [
    {
      id: 'responsibility-table',
      kind: 'table',
      label: 'Typical responsibilities',
      sub: 'documented, verify per connector',
      headers: ['Task', 'Your job', 'Connector'],
      values: [
        ['Read the source', 'your code', 'connector'],
        ['Remember progress', 'your checkpoint', 'connector state'],
        ['Handle schema change', 'your options', 'connector rules'],
        ['Respect source limits', 'you tune', 'connector limits'],
        ['Govern the tables', 'you', 'you'],
      ],
    },
    {
      id: 'connector-questions',
      kind: 'list',
      label: 'Before choosing',
      items: [
        'Is the source supported?',
        'What can it not do?',
        'How much load may it put on the source?',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'responsibility-table', target: 'connector-questions' }],
}
