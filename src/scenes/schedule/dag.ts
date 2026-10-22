import type { Scene, SceneNode } from '@graphlearning/flow'
import yml from '../../../spine/schedule/02-params/project/resources/retail_daily.yml?raw'

// resources/retail_daily.yml — DOCUMENTED, not run (Lakeflow Jobs as a bundle resource: tasks,
// depends_on, run_if, condition_task, python_wheel_task, pipeline_task, schedule, run_as; checked
// through search summaries of the docs, field names to re-check before publishing). The DAG is the one
// those depends_on lines declare.
const t = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon, pattern })

export const dag: Scene = {
  id: 'job-dag',
  framed: true,
  padding: 0.03,
  flow: 'LR',
  align: 'start',
  nodes: [
    { id: 'job-yml', kind: 'code', filename: 'resources/retail_daily.yml — documented, not run', label: yml, highlight: [7, 12, 15, 18, 24, 31, 38, 39, 43] },
    {
      id: 'job-right',
      label: 'job-right',
      bare: true,
      children: [
        {
          id: 'tasks',
          label: 'The DAG those depends_on lines declare',
          pattern: 'network',
          icon: 'workflow',
          children: [
            t('ingest', 'ingest', 'wheel task', 'package', 'network'),
            t('transform', 'transform', 'wheel task', 'funnel', 'network'),
            t('validate', 'validate', 'wheel task', 'shieldcheck', 'network'),
            t('rows_ok', 'rows_ok', 'condition: publish only if true', 'scale', 'network'),
            t('publish', 'publish', 'wheel task, 1 retry', 'sigma', 'network'),
            t('alert', 'alert', 'runs if one failed', 'bell', 'warn'),
          ],
          edges: [
            { source: 'ingest', target: 'transform' },
            { source: 'transform', target: 'validate' },
            { source: 'ingest', target: 'rows_ok' },
            { source: 'validate', target: 'publish' },
            { source: 'rows_ok', target: 'publish' },
            { source: 'transform', target: 'alert' },
          ],
        },
        {
          id: 'task-kinds',
          kind: 'table',
          label: 'What a task can run (documented)',
          headers: ['task type', 'runs'],
          values: [
            ['notebook_task', 'a notebook'],
            ['python_wheel_task', 'an entry point of a wheel'],
            ['pipeline_task', 'an update of a pipeline'],
            ['sql_task', 'a query or file, on a SQL warehouse'],
            ['condition_task', 'nothing: it compares two values'],
            ['for_each_task', 'one task per item of a list'],
          ],
        },
      ],
    },
  ],
  edges: [],
}
