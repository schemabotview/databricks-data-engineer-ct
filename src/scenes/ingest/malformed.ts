import type { Scene } from '@graphlearning/flow'
import { ingestFrame } from './frame'
import code from '../../../spine/ingest/06-malformed/project/tools/ingest/malformed.py?raw'
import raw from '../../../spine/ingest/06-malformed/session.txt?raw'

// PERMISSIVE parsing with a corrupt-record column — a real run (spine/ingest/06): o7's raw line kept,
// 8 = 7 + 1. Auto Loader's _rescued_data is DOCUMENTED, via search summaries.
export const malformed: Scene = ingestFrame('malformed-records', 6, 'tools/ingest/malformed.py', { code, highlight: [6, 10, 11, 12, 13, 14, 17], terminal: raw }, ['tools/ingest/malformed.py'], {
  id: 'malformed-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'modes',
      kind: 'table',
      label: 'Three parse modes',
      headers: ['mode', 'a bad row'],
      values: [
        ['PERMISSIVE', 'kept, nulls + raw line'],
        ['DROPMALFORMED', 'dropped, silently'],
        ['FAILFAST', 'the read fails'],
      ],
    },
    {
      id: 'malformed-facts',
      kind: 'list',
      icon: 'shieldcheck',
      label: 'Quarantine, then reconcile',
      pattern: 'service',
      items: [
        'Keep the raw line: someone must fix the source',
        'Count both sides: 8 = 7 parsed + 1 quarantined',
        'Auto Loader’s _rescued_data does this (documented)',
        'Course 7 turns this into quality rules',
      ],
    },
  ],
})
