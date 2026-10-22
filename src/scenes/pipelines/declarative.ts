import type { Scene } from '@graphlearning/flow'
import run from '../../../spine/pipelines/04-expectations/project/src/retail/run.py?raw'
import retail from '../../../spine/pipelines/04-expectations/project/pipelines/retail.py?raw'

// The same bronze → silver → gold flow twice: src/retail/run.py as the application we wrote and run
// (Course 7), and pipelines/retail.py as Lakeflow Declarative Pipelines definitions — DOCUMENTED, not
// run (`from pyspark import pipelines as dp`, `@dp.table`, `@dp.materialized_view`, expectations;
// names checked through search summaries of the docs).
export const declarative: Scene = {
  id: 'imperative-declarative',
  framed: true,
  padding: 0.03,
  align: 'start',
  flow: 'LR',
  nodes: [
    {
      id: 'left',
      label: 'left',
      bare: true,
      children: [
        { id: 'imperative', kind: 'code', filename: 'src/retail/run.py — run (Course 7)', label: run, show: [[1, 10]], highlight: [8, 9, 10] },
        {
          id: 'who-decides',
          kind: 'table',
          label: 'Who decides what',
          headers: ['', 'run.py: we do', 'a pipeline: it does'],
          values: [
            ['order of the steps', 'we call them in order', 'from what each reads'],
            ['what is new', 'our checkpoint', 'its checkpoints'],
            ['tables', 'our CREATE, our writes', 'declared once, kept in step'],
            ['bad rows', 'our quarantine code', 'expectations'],
            ['a failure', 'we rerun the script', 'it retries the update'],
          ],
        },
        {
          id: 'declarative-facts',
          kind: 'list',
          icon: 'workflow',
          label: 'Declarative, not magic',
          pattern: 'service',
          items: [
            'A function returns a dataset; it never writes one',
            'Reading another dataset by name is the dependency',
            'The pipeline builds the graph, then runs it',
            'The transformations are the same Spark',
          ],
        },
      ],
    },
    { id: 'declared', kind: 'code', filename: 'pipelines/retail.py — documented, not run', label: retail, highlight: [3, 9, 17, 18, 22, 28, 31] },
  ],
  edges: [],
}
