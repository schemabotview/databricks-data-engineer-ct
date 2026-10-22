import type { Scene } from '@graphlearning/flow'
import { changesFrame } from './frame'
import code from '../../../spine/changes/09-cdf-vs-cdc/project/tools/changes/cdf_vs_cdc.py?raw'
import raw from '../../../spine/changes/09-cdf-vs-cdc/session.txt?raw'

// The source's eight change records applied to a table with the change feed on, and the feed read back
// — a real run (spine/changes/09): 3 inserts in version 1, 3 pre- and post-images in version 2, 9 rows.
export const cdfVsCdc: Scene = changesFrame('cdf-vs-cdc', 9, 'tools/changes/cdf_vs_cdc.py', { code, show: [[5, 19]], highlight: [7, 13, 15, 17, 19], terminal: raw }, ['tools/changes/cdf_vs_cdc.py'], {
  id: 'cdf-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'two-feeds',
      kind: 'table',
      label: 'Two feeds, two questions',
      headers: ['', 'source CDC', 'table CDF'],
      values: [
        ['from', 'the till system', 'Delta'],
        ['tells', 'what it did', 'what we did'],
        ['here', '8 records', '9 rows'],
        ['late o1, repeat o3', 'sent', 'no change'],
      ],
    },
    {
      id: 'cdf-facts',
      kind: 'list',
      icon: 'layers',
      label: 'Which one to read',
      pattern: 'service',
      items: [
        'Building silver from a source: read its CDC',
        'Building gold from silver: read silver’s CDF',
        'The CDF holds only what the MERGE changed',
        'An update is two rows: a pre-image and a post-image',
        'Batch 3 changed nothing, so the feed has no rows for it',
      ],
    },
  ],
})
