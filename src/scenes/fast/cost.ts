import type { Scene } from '@graphlearning/flow'
import { fastFrame } from './frame'
import code from '../../../spine/fast/08-cost/project/tools/fast/cost.py?raw'
import raw from '../../../spine/fast/08-cost/session.txt?raw'

// HYPOTHETICAL cost arithmetic (3 s a file, 2 machines, 1 unit a machine-hour, 24 runs a day — all
// assumptions, no prices) on MEASURED files read from §6: 0.96 / 0.08 / 0.04 / 28.80 units a day.
export const cost: Scene = fastFrame('fast-comparison', 8, 'tools/fast/cost.py', { code, show: [[6, 19]], highlight: [6, 7, 8, 9, 11, 12, 16, 17], terminal: raw }, ['tools/fast/cost.py'], {
  id: 'cost-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'tiers',
      kind: 'table',
      label: 'What each number is',
      headers: ['input', 'kind'],
      values: [
        ['files read per layout', 'measured (§6)'],
        ['seconds per file', 'assumed'],
        ['machines, unit rate', 'assumed'],
        ['runs a day', 'assumed: hourly'],
      ],
    },
    {
      id: 'cost-facts',
      kind: 'list',
      icon: 'scale',
      label: 'A comparison you can defend',
      pattern: 'service',
      items: [
        'Same checksum first: 1,000,000 rows, 50,497,436.00',
        'Then the measured work: files opened per query',
        'Cost is work × assumptions: state every one',
        'Partitioned by date: 720× the work for this filter',
        'Re-measure on the platform before deciding',
      ],
    },
  ],
})
