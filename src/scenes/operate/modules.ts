import type { Scene } from '@graphlearning/flow'
import { operateFrame } from './frame'
import code from '../../../spine/operate/01-modules/project/src/retail/jobs.py?raw'
import raw from '../../../spine/operate/01-modules/session.txt?raw'

// The package as the unit of code, and the one local file — a real run (spine/operate/01): the job's
// entry points (src/retail/jobs.py, new) call the same modules as every lesson, and only session.py
// names local[2], Hive support or Delta's pip helper. silver.py gains latest() so §3 can test it.
export const modules: Scene = operateFrame('operate-modules', 1, 'src/retail/jobs.py', { code, show: [[8, 13], [16, 24]], highlight: [9, 13, 18, 23, 24], terminal: raw }, ['src/retail/jobs.py', 'src/retail/silver.py'], {
  id: 'modules-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'layers',
      kind: 'table',
      label: 'Where each kind of code lives',
      headers: ['code', 'lives in', 'runs'],
      values: [
        ['the logic', 'src/retail/', 'everywhere'],
        ['the job’s steps', 'src/retail/jobs.py', 'as wheel tasks'],
        ['exploring', 'notebooks/', 'by hand'],
        ['lessons, checks', 'tools/', 'by hand'],
        ['where Spark runs', 'session.py', 'locally only'],
      ],
    },
    {
      id: 'modules-facts',
      kind: 'list',
      icon: 'package',
      label: 'The local / remote boundary',
      pattern: 'service',
      items: [
        'One file knows the code runs locally: session.py',
        'On Databricks the runtime provides the session',
        'Everything else takes a session and does not care',
        'A notebook imports the package; it never copies it',
        'silver.latest() is now a function: §3 tests it alone',
      ],
    },
  ],
})
