import type { Scene } from '@graphlearning/flow'
import { fastFrame } from './frame'
import code from '../../../spine/fast/02-evidence/project/tools/fast/evidence.py?raw'
import raw from '../../../spine/fast/02-evidence/session.txt?raw'

// The Spark UI's numbers read from its REST API — a real run (spine/fast/02): rows read per task on a
// skewed shuffle 36,115 / 43,880 / 64,525 / 855,480 / 855,480; 1,000 rows aggregated by 200 tasks, 4,
// and 1 with AQE. Query profiles and the Databricks UI are DOCUMENTED.
export const evidence: Scene = fastFrame('fast-evidence', 2, 'tools/fast/evidence.py', { code, show: [[14, 18], [21, 30]], highlight: [14, 16, 23, 24, 28], terminal: raw }, ['tools/fast/evidence.py'], {
  id: 'evidence-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'quantiles',
      kind: 'table',
      label: 'One shuffle, four tasks',
      headers: ['task quantile', 'rows read'],
      values: [
        ['min', '36,115'],
        ['median', '64,525'],
        ['max', '855,480: 13× the median'],
      ],
    },
    {
      id: 'evidence-facts',
      kind: 'list',
      icon: 'search',
      label: 'Read the evidence, then change one thing',
      pattern: 'service',
      items: [
        'A max far above the median is skew: one task does it all',
        '200 tasks for 1,000 rows is overhead, not work',
        'AQE merged them into one, after seeing the sizes',
        'Databricks shows the same in its Spark UI and query profile (documented)',
      ],
    },
  ],
})
