import type { Scene } from '@graphlearning/flow'
import { scheduleFrame } from './frame'
import code from '../../../spine/schedule/06-run-as/project/tools/schedule/run_as.py?raw'
import raw from '../../../spine/schedule/06-run-as/session.txt?raw'

// run_as: the job runs with retail-job's privileges — checked by Course 4's grant MODEL
// (spine/schedule/06): ingest's write to bronze and publish's write to gold are refused under
// governance/grants.sql. run_as itself is DOCUMENTED, not run.
export const runAs: Scene = scheduleFrame('job-run-as', 6, 'tools/schedule/run_as.py', { code, highlight: [4, 8, 9, 10, 11], terminal: raw }, ['tools/schedule/run_as.py'], {
  id: 'run-as-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'identities',
      kind: 'table',
      label: 'Three identities, three jobs',
      headers: ['identity', 'kind', 'used for'],
      values: [
        ['ana', 'person', 'writes, deploys'],
        ['retail-job', 'principal', 'every scheduled run'],
        ['finance', 'group', 'reads gold'],
      ],
    },
    {
      id: 'run-as-facts',
      kind: 'list',
      icon: 'key',
      label: 'A run is somebody',
      pattern: 'service',
      items: [
        'run_as decides whose privileges every task uses',
        'A service principal, not the person who deployed it',
        'The model finds two gaps before the first 06:30 run',
        'Grant MODIFY on bronze and gold, or split the job',
        'Least privilege: each grant names a task that needs it',
      ],
    },
  ],
})
