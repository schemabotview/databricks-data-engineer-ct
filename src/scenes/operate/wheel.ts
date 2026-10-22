import type { Scene } from '@graphlearning/flow'
import { operateFrame } from './frame'
import code from '../../../spine/operate/02-wheel/project/pyproject.toml?raw'
import raw from '../../../spine/operate/02-wheel/session.txt?raw'

// A real wheel built from pyproject.toml (spine/operate/02): retail_lakehouse-0.1.0-py3-none-any.whl,
// the package's modules, no required dependency (pytest only as an extra), five entry points.
export const wheel: Scene = operateFrame('operate-wheel', 2, 'pyproject.toml', { code, show: [[5, 18]], highlight: [5, 6, 9, 12, 13, 17], terminal: raw }, ['pyproject.toml', 'tools/operate/wheel_contents.py', 'dist'], {
  id: 'wheel-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'carries',
      kind: 'table',
      label: 'The wheel, and the runtime',
      headers: ['', 'comes from'],
      values: [
        ['retail/*.py', 'the wheel'],
        ['entry points', 'the wheel'],
        ['pytest', 'only with the test extra'],
        ['PySpark, Delta', 'the runtime'],
        ['Python, Java', 'the runtime'],
      ],
    },
    {
      id: 'wheel-facts',
      kind: 'list',
      icon: 'package',
      label: 'What a wheel must not carry',
      pattern: 'warn',
      items: [
        'A second PySpark would fight the runtime’s own',
        'So Spark and Delta are not dependencies',
        'Locally they come from requirements.txt',
        'Match the runtime’s versions: Course 2 §4',
      ],
    },
  ],
})
