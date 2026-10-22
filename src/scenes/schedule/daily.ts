import type { Scene } from '@graphlearning/flow'
import { scheduleFrame } from './frame'
import code from '../../../spine/schedule/07-daily/project/tools/schedule/daily.py?raw'
import raw from '../../../spine/schedule/07-daily/session.txt?raw'

// The job model over the project's own modules on two days (spine/schedule/07): every task SUCCEEDED
// both times, 11 events, 6 silver, 3 bad, gold 170.00 — the second day, with no new files, changes
// nothing, because bronze's checkpoint and the overwrites make every task repeat-safe.
export const daily: Scene = scheduleFrame('job-orchestrated', 7, 'tools/schedule/daily.py', { code, show: [[18, 31]], highlight: [19, 20, 21, 22, 26, 28], terminal: raw }, ['tools/schedule/daily.py'], {
  id: 'daily-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'repeat-safe',
      kind: 'table',
      label: 'Why day two changes nothing',
      headers: ['task', 'repeat-safe because'],
      values: [
        ['ingest', 'the checkpoint (Course 6)'],
        ['transform', 'silver is rebuilt whole'],
        ['validate', 'reads, never writes'],
        ['publish', 'INSERT OVERWRITE gold'],
      ],
    },
    {
      id: 'daily-facts',
      kind: 'list',
      icon: 'workflow',
      label: 'The orchestrated flow',
      pattern: 'service',
      items: [
        'The job decides when and in what order',
        'Each task decides what it writes, and how safely',
        'Validate stands between the data and its readers',
        'The real job: resources/retail_daily.yml, Course 12',
      ],
    },
  ],
})
