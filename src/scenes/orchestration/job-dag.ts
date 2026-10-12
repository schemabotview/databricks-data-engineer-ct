import type { Scene } from '@graphlearning/flow'

// §8.1 — the retail job as a DAG of tasks, with the task types that can play each role. DOCUMENTED, NOT
// RUN: no Databricks workspace. YAML follows the shape of a job resource (task_key, depends_on, a task
// type per task); field names must be re-verified against the live docs. The DAG itself is the one the
// Chapter 8 local model runs (scripts/verify/ch08_orchestration_model.py).
export const jobDag: Scene = {
  id: 'job-dag',
  title: 'The retail job as a DAG',
  flow: 'TB',
  nodes: [
    {
      id: 'task-chain',
      label: 'Tasks and their order',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'task-ingest', label: 'ingest', sub: 'pipeline task', pattern: 'service', icon: 'database' },
        { id: 'task-transform', label: 'transform', sub: 'SQL or notebook', pattern: 'service', icon: 'funnel' },
        { id: 'task-validate', label: 'validate', sub: 'checks', pattern: 'service', icon: 'shieldcheck' },
        { id: 'task-publish', label: 'publish', sub: 'writes gold', pattern: 'service', icon: 'sigma' },
      ],
      edges: [
        { source: 'task-ingest', target: 'task-transform' },
        { source: 'task-transform', target: 'task-validate' },
        { source: 'task-validate', target: 'task-publish' },
      ],
    },
    {
      id: 'job-evidence',
      label: 'How it is written',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'job-yaml',
          kind: 'code',
          filename: 'job.yml  (documented, not run)',
          label: `resources:
  jobs:
    retail_daily:
      tasks:
        - task_key: ingest
          pipeline_task: {...}
        - task_key: transform
          depends_on:
            - task_key: ingest
          sql_task: {...}`,
        },
        {
          id: 'task-types',
          kind: 'table',
          label: 'Task roles',
          sub: 'documented',
          headers: ['Task type', 'Runs'],
          values: [
            ['notebook', 'Python or SQL logic'],
            ['pipeline', 'a declarative pipeline'],
            ['SQL', 'a query on a warehouse'],
            ['packaged code', 'a wheel or JAR'],
          ],
        },
      ],
    },
  ],
  edges: [{ source: 'task-chain', target: 'job-evidence' }],
}
