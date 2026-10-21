import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { startTree } from './tree'
import requirements from '../../../spine/start/02-new-project/captured/requirements.txt?raw'
import session from '../../../spine/start/02-new-project/session.txt?raw'

// A real replay (scripts/spine.py): the pip install runs, `pip freeze` writes what the editor shows,
// and `java -version` is this machine's JDK.
export const newProject: Scene = ideFrame(
  'new-project',
  'retail-lakehouse',
  startTree(2, 'requirements.txt', ['requirements.txt']),
  { file: 'requirements.txt', code: requirements, highlight: [1, 4], terminal: session },
  {
    id: 'new-project-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'new-project-steps',
        kind: 'table',
        label: 'Five commands, one project',
        headers: ['command', 'what it does'],
        values: [
          ['python -m venv .venv', 'the project’s own Python'],
          ['source …/activate', 'use it in this terminal'],
          ['pip install …', 'Spark and Delta, pinned'],
          ['pip freeze > …', 'write down what came'],
          ['java -version', 'the JVM Spark runs on'],
        ],
      },
      {
        id: 'new-project-facts',
        kind: 'list',
        icon: 'package',
        label: 'What the requirements say',
        pattern: 'service',
        items: [
          'pyspark is Spark itself, with its JVM jars',
          'delta-spark is Delta’s Python side',
          'Delta’s own jars arrive on the first run',
          'Java 17 or 21: Spark 4 needs one',
        ],
      },
    ],
  },
)
