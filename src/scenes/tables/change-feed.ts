import type { Scene } from '@graphlearning/flow'
import { labFrame } from './frame'
import code from '../../../spine/tables/07-change-feed/project/tools/delta/change_feed.py?raw'
import raw from '../../../spine/tables/07-change-feed/session.txt?raw'

// A CONFIGURED change data feed (delta.enableChangeDataFeed = true) — a real run (spine/tables/07).
// Automatic feeds on eligible platform tables are not tested and not claimed.
export const changeFeed: Scene = labFrame('change-feed', 7, code, raw, { show: [[9, 18], [23, 27]], highlight: [10, 15, 17, 23, 24, 26] }, {
  id: 'feed-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'change-types',
      kind: 'table',
      label: 'One row per change',
      headers: ['_change_type', 'is'],
      values: [
        ['insert', 'a new row'],
        ['update_preimage', 'the row before'],
        ['update_postimage', 'the row after'],
        ['delete', 'the row removed'],
      ],
    },
    {
      id: 'feed-facts',
      kind: 'list',
      icon: 'history',
      label: 'Not an archive',
      pattern: 'warn',
      items: [
        'Recorded only from the version it was enabled',
        'Kept only as long as VACUUM keeps its files',
        'Readers ask for a version range',
        'Course 8 compares it with a source’s CDC',
      ],
    },
  ],
})
