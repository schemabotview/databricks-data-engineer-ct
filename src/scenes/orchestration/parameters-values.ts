import type { Scene } from '@graphlearning/flow'

// §8.2 — a value travelling through a job, and what a condition does with it. The reference syntax is
// DOCUMENTED, NOT RUN (job parameter {{job.parameters.name}}; task values set with dbutils.jobs.taskValues
// and read as {{tasks.<task>.values.<name>}} — the task-values spelling was not confirmed by the search
// summaries and must be re-verified). The trace table is from the LOCAL MODEL; rows_read are real counts.
export const parametersValues: Scene = {
  id: 'parameters-values',
  title: 'Parameters in, task values across',
  flow: 'TB',
  nodes: [
    {
      id: 'reference-code',
      kind: 'code',
      filename: 'references  (documented, not run)',
      label: `# a job parameter, inside a task
{{job.parameters.run_date}}

# a task value: set in one task...
dbutils.jobs.taskValues.set("rows_read", 8)
# ...read by a downstream task
{{tasks.ingest.values.rows_read}}`,
    },
    {
      id: 'propagation-table',
      kind: 'table',
      label: 'Two runs through the condition',
      sub: 'local model, real row counts',
      headers: ['Run', 'rows_read', 'rows_ok', 'publish'],
      values: [
        ['all 3 files', '8', 'true', 'runs'],
        ['file c missing', '6', 'false', 'excluded'],
      ],
    },
  ],
  edges: [{ source: 'reference-code', target: 'propagation-table' }],
}
