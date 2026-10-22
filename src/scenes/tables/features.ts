import type { Scene } from '@graphlearning/flow'
import { labFrame } from './frame'
import code from '../../../spine/tables/08-features/project/tools/delta/features.py?raw'
import raw from '../../../spine/tables/08-features/session.txt?raw'

// DESCRIBE DETAIL on the three lab tables — a real run (spine/tables/08): reader/writer 1/2, 1/7 with
// changeDataFeed, 1/3 with checkConstraints. Platform-only features are DOCUMENTED, via search summaries.
export const features: Scene = labFrame('table-features', 8, code, raw, { highlight: [5, 6, 7, 8] }, {
  id: 'features-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'protocol',
      kind: 'table',
      label: 'A feature raises the bar',
      headers: ['table', 'needs'],
      values: [
        ['lab.ret', 'writer 2'],
        ['lab.feed', 'writer 7: changeDataFeed'],
        ['lab.contract', 'writer 3: checkConstraints'],
      ],
    },
    {
      id: 'features-facts',
      kind: 'list',
      icon: 'scale',
      label: 'Before you turn one on',
      pattern: 'warn',
      items: [
        'Every reader and writer must support it',
        'Some features cannot be turned off again',
        'Databricks has features open Delta lacks',
        'Check what else reads the table first',
      ],
    },
  ],
})
