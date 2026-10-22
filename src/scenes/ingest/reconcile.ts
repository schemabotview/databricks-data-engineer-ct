import type { Scene } from '@graphlearning/flow'
import { ingestFrame } from './frame'
import code from '../../../spine/ingest/09-reconcile/project/tools/ingest/reconcile.py?raw'
import raw from '../../../spine/ingest/09-reconcile/session.txt?raw'

// bronze.ingest over the three landed files, then counted — a real run (spine/ingest/09): 3 + 3 + 2 =
// 8 rows, 7 order ids, o4 twice from two files.
export const reconcile: Scene = ingestFrame('bronze-walkthrough', 9, 'tools/ingest/reconcile.py', { code, highlight: [6, 9, 10, 12, 13], terminal: raw }, ['tools/ingest/reconcile.py'], {
  id: 'reconcile-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'counts',
      kind: 'table',
      label: 'Source to bronze, counted',
      headers: ['', 'rows'],
      values: [
        ['three files landed', '3 + 3 + 2'],
        ['bronze.orders', '8'],
        ['distinct order ids', '7'],
        ['o4, sent twice', '2 rows, 2 files'],
      ],
    },
    {
      id: 'bronze-rules',
      kind: 'list',
      icon: 'database',
      label: 'What bronze promises',
      pattern: 'storage',
      items: [
        'Every row that arrived, once per arrival',
        'Its source file, to trace it back',
        'Nothing dropped, nothing fixed — that is silver',
        'A backfill re-lands files; the checkpoint skips the old',
      ],
    },
  ],
})
