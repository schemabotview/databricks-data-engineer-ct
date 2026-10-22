import type { Scene } from '@graphlearning/flow'
import { labFrame } from './frame'
import code from '../../../spine/tables/01-versions/project/tools/delta/versions.py?raw'
import raw from '../../../spine/tables/01-versions/session.txt?raw'

// The Course 5 timeline of CLAUDE.md, versions 0–2, read off the log of a real run.
export const versions: Scene = labFrame('delta-versions', 1, code, raw, { show: [[8, 23]], highlight: [10, 11, 12, 16, 19, 21, 22] }, {
  id: 'versions-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'actions',
      kind: 'table',
      label: 'What each commit holds',
      headers: ['action', 'means'],
      values: [
        ['commitInfo', 'who, when, which operation'],
        ['metaData', 'the schema and settings'],
        ['protocol', 'what a reader must support'],
        ['add', 'this file is now in the table'],
        ['remove', 'this file no longer is'],
      ],
    },
    {
      id: 'versions-facts',
      kind: 'list',
      icon: 'layers',
      label: 'A version is a list of files',
      pattern: 'storage',
      items: [
        'Each commit is one JSON file, numbered in order',
        'Version N = every add, minus every remove, to N',
        'Reading an old version is reading an older list',
        'Files are never edited — only added and removed',
      ],
    },
  ],
})
