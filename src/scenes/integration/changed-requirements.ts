import type { Scene } from '@graphlearning/flow'

// §11.2 — three changed requirements applied to the same design. LOCAL RUN (scripts/verify/
// ch11_integration.py, reusing the real examples/retail_etl package). Gold after all three changes is the
// last table; 215.00 = 173.00 (correction) + 30.00 + 12.00 (the two partner orders that mapped).
export const changedRequirements: Scene = {
  id: 'changed-requirements',
  title: 'A correction, a new source, a faster refresh',
  flow: 'TB',
  nodes: [
    {
      id: 'change-table',
      kind: 'table',
      label: 'Three changes to the same design',
      sub: 'local run',
      headers: ['Change', 'Response', 'Result'],
      values: [
        ['o4 corrected to 18.00', 'latest event wins', 'York 18.00, total 173.00'],
        ['partner feed, store codes', 'map codes, reject unknown', '2 of 3 load, total 215.00'],
        ['daily to every 15 min', 'micro-batch guarded MERGE', 'equals the full recompute'],
      ],
    },
    {
      id: 'gold-after',
      kind: 'table',
      label: 'gold_sales after all three',
      sub: 'total 215.00',
      headers: ['store', 'orders', 'sales'],
      values: [
        ['Leeds', '4', '105.00'],
        ['York', '2', '30.00'],
        ['Hull', '1', '80.00'],
      ],
    },
    {
      id: 'o4-history',
      kind: 'table',
      label: 'History of o4 (SCD type 2)',
      sub: 'both versions kept',
      headers: ['amount', 'start', 'end'],
      values: [
        ['15.00', '10-01 09:14', '10-02 08:00'],
        ['18.00', '10-02 08:00', 'open'],
      ],
    },
  ],
  edges: [
    { source: 'change-table', target: 'gold-after' },
    { source: 'gold-after', target: 'o4-history' },
  ],
}
