import type { Scene } from '@graphlearning/flow'

// §1.1 — three consumers of the same order data, each with a different freshness and correctness
// need. The requirements are ILLUSTRATIVE assumptions for the recurring retail example, not
// measurements. The list card turns them into the questions a design starts from.
export const requirementsMatrix: Scene = {
  id: 'requirements-matrix',
  title: 'Who needs the orders, and how well',
  flow: 'TB',
  nodes: [
    {
      id: 'consumers-table',
      kind: 'table',
      label: 'Three consumers, one order feed',
      sub: 'illustrative requirements',
      headers: ['Consumer', 'Freshness', 'Must be right', 'Cost lever'],
      values: [
        ['Finance close', 'daily by 06:00', 'to the cent', 'one nightly run'],
        ['Store dashboard', 'about 15 min', 'counts first', 'frequent small runs'],
        ['Analyst history', 'next day', 'no duplicates', 'keep all history'],
      ],
    },
    {
      id: 'design-questions',
      kind: 'list',
      label: 'Questions every design starts from',
      items: [
        'Who reads it, and when?',
        'How old may the data be?',
        'What counts as wrong?',
        'What is it worth paying?',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'consumers-table', target: 'design-questions' }],
}
