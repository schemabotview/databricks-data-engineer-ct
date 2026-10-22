import type { Scene } from '@graphlearning/flow'
import { operateFrame } from './frame'
import code from '../../../spine/operate/03-tests/project/tests/test_flow.py?raw'
import raw from '../../../spine/operate/03-tests/session.txt?raw'

// The project's tests, run with pytest (spine/operate/03, volatile: pytest prints its own time):
// 7 passed — 4 unit (tests/test_quality.py), 1 integration and 2 data-quality (tests/test_flow.py).
// Then a bug that raises nothing (oldest file first) caught by the tests' helper as a row diff.
export const tests: Scene = operateFrame('operate-tests', 3, 'tests/test_flow.py', { code, show: [[9, 11], [19, 21], [24, 30]], highlight: [19, 21, 24, 30], terminal: raw }, ['tests', 'tools/operate/bug_diff.py'], {
  id: 'tests-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'kinds',
      kind: 'table',
      label: 'Seven tests, three kinds',
      headers: ['kind', 'tests', 'on'],
      values: [
        ['unit', '4', 'rows written in the test'],
        ['integration', '1', 'files a–d, end to end'],
        ['data quality', '2', 'the tables it built'],
      ],
    },
    {
      id: 'tests-facts',
      kind: 'list',
      icon: 'shieldcheck',
      label: 'A diff you can read',
      pattern: 'service',
      items: [
        'The bug runs without an error, and is wrong',
        'Expected against actual, as rows: missing, unexpected',
        'o4: same row, older file; o6: PENDING came back',
        'Tests run locally, before anything is deployed',
      ],
    },
  ],
})
