import type { Scene } from '@graphlearning/flow'

// §4.1 — what is written down about a source before it is ingested. The files are the course's three
// landing CSVs (3 + 3 + 2 rows, see scripts/verify/ch04_ingestion.py). Source retention is an
// ASSUMPTION for the example, not a measurement.
export const sourceContract: Scene = {
  id: 'source-contract',
  title: 'A source contract for the order files',
  flow: 'TB',
  nodes: [
    {
      id: 'contract-table',
      kind: 'table',
      label: 'The order files, written down',
      sub: 'one row per promise the source makes',
      headers: ['Property', 'Retail files', 'Drives'],
      values: [
        ['Format', 'CSV with header', 'parse rules'],
        ['Key', 'order_id', 'dedupe key'],
        ['Arrival', 'a file at a time', 'incremental read'],
        ['Duplicates', 'o4 sent twice', 'a dedupe rule'],
        ['Retention', 'assumed 30 days', 'replay window'],
      ],
    },
    {
      id: 'contract-questions',
      kind: 'list',
      label: 'Ask before ingesting',
      items: [
        'Can a key repeat? Across files?',
        'Can old files change or vanish?',
        'How long can I replay?',
        'Who tells me about format changes?',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'contract-table', target: 'contract-questions' }],
}
