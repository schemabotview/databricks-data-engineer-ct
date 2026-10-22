import type { Scene } from '@graphlearning/flow'
import { scheduleFrame } from './frame'
import code from '../../../spine/schedule/04-failure/project/tools/schedule/jobs.py?raw'
import raw from '../../../spine/schedule/04-failure/session.txt?raw'

// A failed transform under the model of the documented run-if rules (spine/schedule/04): validate and
// publish SKIPPED, rows_ok SUCCEEDED, the AT_LEAST_ONE_FAILED alert SUCCEEDED. A MODEL, with real Spark
// task bodies; it proves nothing about the platform.
export const failure: Scene = scheduleFrame('job-failure-paths', 4, 'tools/schedule/jobs.py', { code, show: [[25, 40]], highlight: [28, 30, 31, 32, 34, 36, 37], terminal: raw }, ['tools/schedule/failure.py'], {
  id: 'failure-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'states',
      kind: 'table',
      label: 'Why each task ended as it did',
      headers: ['task', 'state', 'because'],
      values: [
        ['transform', 'FAILED', 'its body raised'],
        ['validate', 'SKIPPED', 'upstream failed'],
        ['publish', 'SKIPPED', 'validate did not succeed'],
        ['rows_ok', 'SUCCEEDED', 'needs only ingest'],
        ['alert', 'SUCCEEDED', 'runs if one failed'],
      ],
    },
    {
      id: 'failure-facts',
      kind: 'list',
      icon: 'bell',
      label: 'A failure path is designed',
      pattern: 'warn',
      items: [
        'ALL_SUCCEEDED is the default: one failure stops the rest',
        'A run-if such as AT_LEAST_ONE_FAILED runs on failure',
        'SKIPPED: upstream failed; EXCLUDED: a condition said no',
        'The run fails, and says which task broke',
      ],
    },
  ],
})
