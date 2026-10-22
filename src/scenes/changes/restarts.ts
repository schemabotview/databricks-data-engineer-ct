import type { Scene } from '@graphlearning/flow'
import { changesFrame } from './frame'
import code from '../../../spine/changes/05-restarts/project/tools/changes/restarts.py?raw'
import raw from '../../../spine/changes/05-restarts/session.txt?raw'

// A windowed stream stopped, a file landed, the stream restarted on the same checkpoint, and then a
// new grouping key — a real run (spine/changes/05): batches 0–2, then 3–4, then
// STATE_STORE_KEY_SCHEMA_NOT_COMPATIBLE; the checkpoint's folders listed.
export const restarts: Scene = changesFrame('checkpoints-restarts', 5, 'tools/changes/restarts.py', { code, show: [[13, 14], [22, 33]], highlight: [14, 23, 24, 25, 28, 30, 33], terminal: raw }, ['tools/changes/restarts.py'], {
  id: 'restarts-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'folders',
      kind: 'table',
      label: 'What the checkpoint holds',
      headers: ['folder', 'remembers'],
      values: [
        ['offsets', 'what each batch was going to read'],
        ['commits', 'which batches finished'],
        ['sources', 'which files were read'],
        ['state', 'the open windows, per partition'],
        ['metadata', 'the query’s id'],
      ],
    },
    {
      id: 'restart-facts',
      kind: 'list',
      icon: 'history',
      label: 'Which changes a restart survives',
      pattern: 'service',
      items: [
        'Stopped and started: it resumes at the next batch',
        'Files that landed meanwhile are read, once',
        'A new filter or column: usually fine',
        'A new grouping key changes the state: refused',
        'Then it needs a new checkpoint, and a backfill',
      ],
    },
  ],
})
