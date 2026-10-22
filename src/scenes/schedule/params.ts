import type { Scene } from '@graphlearning/flow'
import { scheduleFrame } from './frame'
import code from '../../../spine/schedule/02-params/project/tools/schedule/tasks.py?raw'
import raw from '../../../spine/schedule/02-params/session.txt?raw'

// Parameters and task values — a MODEL run locally (spine/schedule/02): ingest sets rows_read, the
// condition task compares it with the expected_rows parameter; 8 rows → publish SUCCEEDED, 6 rows (file
// c not yet landed) → publish EXCLUDED. The {{…}} references are DOCUMENTED; the task-values call
// spelling is UNVERIFIED and labelled so.
export const params: Scene = scheduleFrame('job-parameters', 2, 'tools/schedule/tasks.py', { code, show: [[42, 42], [58, 60], [77, 86]], highlight: [42, 59, 60, 82, 83], terminal: raw }, ['tools/schedule'], {
  id: 'params-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'flows',
      kind: 'table',
      label: 'What flows where (documented)',
      headers: ['value', 'set by', 'read by'],
      values: [
        ['run_date', 'the job', 'every task'],
        ['rows_read', 'ingest', 'rows_ok'],
        ['rows_ok outcome', 'rows_ok', 'publish'],
      ],
    },
    {
      id: 'params-facts',
      kind: 'list',
      icon: 'key',
      label: 'Small values, not data',
      pattern: 'service',
      items: [
        'A task reads a parameter as {{job.parameters.run_date}}',
        'and a task value as {{tasks.ingest.values.rows_read}}',
        'A task value is a small value set by one task',
        'Setting one in code: dbutils.jobs.taskValues (re-check)',
        'Here: a model of the rules; the 8 and 6 are real counts',
      ],
    },
  ],
})
