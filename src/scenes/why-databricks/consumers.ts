import type { Scene, SceneNode } from '@graphlearning/flow'

// Three consumers of the same order feed. Their requirements are the course's ILLUSTRATIVE
// assumptions for the retail example, chosen to show the trade-offs — not measurements of a company.
const consumer = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern'], items: string[]): SceneNode =>
  ({ id, kind: 'list', label, sub, icon, pattern, items })

export const consumers: Scene = {
  id: 'data-product-consumers',
  framed: true,
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'readers',
      label: 'One order feed, three readers (illustrative requirements)',
      bare: true,
      cols: 3,
      align: 'start',
      stretch: true,
      children: [
        consumer('finance', 'Finance close', 'reads once a day', 'receipt', 'service', [
          'Freshness: yesterday’s totals by 06:00',
          'Correct: to the cent, every order once',
          'Cost: one nightly run is enough',
          'Wrong is worse than late',
        ]),
        consumer('dashboard', 'Store dashboard', 'reads all day', 'gauge', 'network', [
          'Freshness: about 15 minutes old',
          'Correct: counts match what the till saw',
          'Cost: many small runs, all day',
          'Late is worse than slightly rough',
        ]),
        consumer('analyst', 'Analyst history', 'reads years at once', 'history', 'storage', [
          'Freshness: next day is fine',
          'Correct: no duplicates, history kept',
          'Cost: storage for every version',
          'Lost history cannot be rebuilt',
        ]),
      ],
    },
    {
      id: 'below',
      label: 'The trade',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'pulls',
          kind: 'table',
          label: 'Every requirement has a price',
          headers: ['asking for', 'costs', 'paid in'],
          values: [
            ['fresher data', 'more runs, or a stream always on', 'compute'],
            ['stricter correctness', 'checks, quarantine, reconciliation', 'latency'],
            ['longer history', 'more versions and files kept', 'storage'],
            ['tighter access', 'grants, identities, audit', 'engineering time'],
          ],
        },
        {
          id: 'questions',
          kind: 'list',
          icon: 'search',
          label: 'Four questions before any feature',
          pattern: 'user',
          items: [
            'Who reads it, and when?',
            'How old may it be when they read it?',
            'What counts as wrong — and who notices?',
            'What is a correct, fresh answer worth?',
          ],
        },
      ],
    },
  ],
  edges: [],
}
