import type { Scene } from '@graphlearning/flow'
import { pipelinesFrame } from './frame'
import code from '../../../spine/pipelines/04-expectations/project/tools/pipelines/policies.py?raw'
import raw from '../../../spine/pipelines/04-expectations/session.txt?raw'

// The three expectation policies on the 11 bronze events — a MODEL run locally (spine/pipelines/04):
// plain Spark applying the project's rules by the documented semantics; warn keeps 11, drop 8, fail
// writes nothing. The decorators in the side table are DOCUMENTED, not run.
export const expectations: Scene = pipelinesFrame('expectations', 4, 'tools/pipelines/policies.py', { code, show: [[6, 19]], highlight: [11, 14, 16, 17, 18, 19], terminal: raw }, ['tools/pipelines/policies.py'], {
  id: 'expectations-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'policies',
      kind: 'table',
      label: 'Three policies, one rule set',
      headers: ['policy', 'decorator', 'keeps', 'metrics'],
      values: [
        ['warn', '@dp.expect', '11', 'yes'],
        ['drop', '@dp.expect_or_drop', '8', 'yes'],
        ['fail', '@dp.expect_or_fail', '0: stops', 'no'],
      ],
    },
    {
      id: 'expect-facts',
      kind: 'list',
      icon: 'shieldcheck',
      label: 'Model, not platform',
      pattern: 'service',
      items: [
        'The numbers: a local model of the documented rules',
        'Drop loses the row: nothing like silver.quarantine',
        'Keep a quarantine table when a dropped row matters',
        'Fail is for rules that must never be broken',
      ],
    },
  ],
})
