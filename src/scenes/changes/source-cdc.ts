import type { Scene } from '@graphlearning/flow'
import { changesFrame } from './frame'
import code from '../../../spine/changes/07-source-cdc/project/src/retail/cdc.py?raw'
import raw from '../../../spine/changes/07-source-cdc/session.txt?raw'

// Eight change records for o1–o3 in three arrival batches, applied naively by arrival and through
// src/retail/cdc.py by sequence, reversed and replayed — a real run (spine/changes/07).
export const sourceCdc: Scene = changesFrame('source-cdc', 7, 'src/retail/cdc.py', { code, show: [[8, 15], [25, 30]], highlight: [10, 12, 15, 27, 28], terminal: raw }, ['data/samples/cdc', 'src/retail/cdc.py', 'tools/changes/cdc_apply.py'], {
  id: 'cdc-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'records',
      kind: 'table',
      label: 'The records, as they arrived',
      headers: ['batch', 'records'],
      values: [
        ['1', 'o1 I 1 · o2 I 1 · o3 I 1'],
        ['2', 'o1 U 3 · o2 U 2 · o3 D 2'],
        ['3', 'o1 U 2 (late) · o3 I 1 (repeat)'],
      ],
    },
    {
      id: 'cdc-facts',
      kind: 'list',
      icon: 'key',
      label: 'Apply by sequence, not arrival',
      pattern: 'service',
      items: [
        'By arrival, a late update wins and a repeat resurrects o3',
        'Keep the newest record per key within a batch',
        'Update only if its sequence is newer than the row’s',
        'A delete is a flag, so a late insert cannot undo it',
        'Same result in any order, and when replayed',
      ],
    },
  ],
})
