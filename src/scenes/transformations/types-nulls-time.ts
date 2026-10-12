import type { Scene } from '@graphlearning/flow'

// §5.3 — four assumptions that change a number without raising an error. LOCAL RUN. The time-zone row is
// the same wall-clock text read under two session time zones (UTC and America/New_York); the nested row
// sums an order-level amount after exploding line items.
export const typesNullsTime: Scene = {
  id: 'types-nulls-time',
  title: 'Parsing, NULL, time zones and nested rows',
  flow: 'TB',
  nodes: [
    {
      id: 'parse-table',
      kind: 'table',
      label: 'try_cast to DECIMAL(10,2)',
      sub: 'and comparing with NULL',
      headers: ['Input', 'Result'],
      values: [
        ['40.00', '40.00'],
        ['n/a', 'NULL'],
        ['-5.00', '-5.00 (parses)'],
        ['= NULL', '0 rows matched'],
        ['IS NULL', '1 row matched'],
      ],
    },
    {
      id: 'assumption-table',
      kind: 'table',
      label: 'Two silent shifts',
      sub: 'local run',
      headers: ['Case', 'Expected', 'Got'],
      values: [
        ['09:14 under two zones', 'one instant', '14,400 s apart'],
        ['sum(amount) after explode', '65.00', '105.00'],
      ],
    },
  ],
  edges: [{ source: 'parse-table', target: 'assumption-table' }],
}
