import type { Scene } from '@graphlearning/flow'
import { ingestFrame } from './frame'
import code from '../../../spine/ingest/05-drift/project/tools/ingest/drift.py?raw'
import raw from '../../../spine/ingest/05-drift/session.txt?raw'

// Two JSON files, the second with "12,50" and a new field — a real run (spine/ingest/05): a fixed
// schema reads 1250.00 with no flag and drops `channel`; inference widens amount from double to string.
// Auto Loader's evolution modes are DOCUMENTED, via search summaries.
export const drift: Scene = ingestFrame('schema-drift', 5, 'tools/ingest/drift.py', { code, highlight: [5, 7, 8, 11, 12, 13, 14], terminal: raw }, ['data/samples/drift', 'tools/ingest/drift.py'], {
  id: 'drift-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'files',
      kind: 'table',
      label: 'The two drift files, field by field',
      headers: ['field', '2.json', '1.json'],
      values: [
        ['order_id', 'o8', 'o1'],
        ['amount', '"12,50": text', '40.00: a number'],
        ['status', 'PENDING', 'COMPLETED'],
        ['channel', 'web', 'absent'],
      ],
    },
    {
      id: 'modes',
      kind: 'table',
      label: 'Auto Loader’s choice (documented)',
      headers: ['schemaEvolutionMode', 'new column'],
      values: [
        ['addNewColumns', 'stop, then add it'],
        ['rescue', 'into _rescued_data'],
        ['failOnNewColumns', 'stop'],
        ['none', 'ignored'],
      ],
    },
    {
      id: 'drift-facts',
      kind: 'list',
      icon: 'search',
      label: 'Silent is the danger',
      pattern: 'warn',
      items: [
        '"12,50" became 1250.00 — no error, no flag',
        'channel was dropped without a word',
      ],
    },
  ],
})
