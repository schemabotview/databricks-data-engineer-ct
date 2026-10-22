import type { Scene } from '@graphlearning/flow'
import { pipelinesFrame } from './frame'
import code from '../../../spine/pipelines/05-source-update/project/tools/pipelines/source_update.py?raw'
import raw from '../../../spine/pipelines/05-source-update/session.txt?raw'

// A stream over a Delta table after an UPDATE of a row it already read — a real run
// (spine/pipelines/05): refused with DELTA_SOURCE_TABLE_IGNORE_CHANGES; skipChangeCommits goes on
// without the update, and still reads a later INSERT.
export const incremental: Scene = pipelinesFrame('incremental-semantics', 5, 'tools/pipelines/source_update.py', { code, show: [[12, 14], [19, 29]], highlight: [12, 20, 22, 26, 29], terminal: raw }, ['tools/pipelines/source_update.py'], {
  id: 'source-update-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'what-arrives',
      kind: 'table',
      label: 'What the stream does with each change',
      headers: ['change to the source', 'the stream'],
      values: [
        ['INSERT', 'reads the new rows'],
        ['UPDATE, DELETE', 'stops: refused'],
        ['… with skipChangeCommits', 'skips that commit'],
      ],
    },
    {
      id: 'incremental-facts',
      kind: 'list',
      icon: 'waves',
      label: 'A streaming table assumes append-only',
      pattern: 'service',
      items: [
        'An update rewrites rows the stream already passed on',
        'Delta refuses rather than guess what to do with it',
        'Skipping keeps it running, and loses the change',
        'Changes belong in a CDC flow: §6',
        'Or in a materialized view, which recomputes',
      ],
    },
  ],
})
