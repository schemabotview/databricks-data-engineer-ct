import type { Scene } from '@graphlearning/flow'
import { changesFrame } from './frame'
import code from '../../../spine/changes/01-incremental/project/tools/changes/incremental.py?raw'
import raw from '../../../spine/changes/01-incremental/session.txt?raw'

// The four stream files arrive one at a time; a recompute reads everything so far each time, a stream
// only what is new — a real run (spine/changes/01): 3 + 6 + 8 + 10 = 27 rows against 10.
export const incremental: Scene = changesFrame('recompute-or-increment', 1, 'tools/changes/incremental.py', { code, highlight: [6, 9, 10, 11, 12, 13], terminal: raw }, ['data/samples/stream', 'tools/changes'], {
  id: 'incremental-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'rows-read',
      kind: 'table',
      label: 'Rows read, as the files arrive',
      headers: ['file', 'recompute', 'incremental'],
      values: [
        ['f1', '3', '3'],
        ['f2', '6', '3'],
        ['f3', '8', '2'],
        ['f4', '10', '2'],
        ['total', '27', '10'],
      ],
    },
    {
      id: 'incremental-facts',
      kind: 'list',
      icon: 'waves',
      label: 'What incremental assumes',
      pattern: 'service',
      items: [
        'The source only appends: a file, once landed, never changes',
        'The checkpoint remembers what was already read',
        'Recompute work grows with history; incremental with arrivals',
        'A change to an old row is not an arrival: Course 8 §7',
      ],
    },
  ],
})
