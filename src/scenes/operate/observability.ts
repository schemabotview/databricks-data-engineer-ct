import type { Scene } from '@graphlearning/flow'

// Observability — DOCUMENTED (system tables, job run timeline, lineage, event logs; via search
// summaries; the audit and lineage system-table names are UNVERIFIED and labelled). The result rows are
// ILLUSTRATIVE, built from this course's own runs.
const SQL = [
  '-- documented, not run: system tables need Unity Catalog',
  'SELECT period_start_time, result_state, termination_code',
  'FROM system.lakeflow.job_run_timeline',
  "WHERE job_id = :retail_daily_job_id",
  'ORDER BY period_start_time DESC',
  'LIMIT 3;',
].join('\n')

export const observability: Scene = {
  id: 'operate-observability',
  framed: true,
  padding: 0.03,
  align: 'start',
  nodes: [
    {
      id: 'obs-top',
      label: 'obs-top',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        { id: 'obs-sql', kind: 'code', filename: 'the job’s recent runs — documented, table name to re-check', label: SQL, highlight: [3, 4] },
        {
          id: 'obs-rows',
          kind: 'table',
          label: 'Illustrative result (Course 10’s failure path)',
          headers: ['run', 'result_state', 'termination'],
          values: [
            ['day 3', 'SUCCEEDED', 'SUCCESS'],
            ['day 2', 'FAILED', 'transform raised'],
            ['day 1', 'SUCCEEDED', 'SUCCESS'],
          ],
        },
      ],
    },
    {
      id: 'obs-below',
      label: 'obs-below',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'signals',
          kind: 'table',
          label: 'Four kinds of evidence (documented)',
          headers: ['signal', 'answers', 'where'],
          values: [
            ['logs', 'what one run printed', 'the run’s output'],
            ['metrics', 'how much, how fast', 'Spark UI, query profile'],
            ['lineage', 'what fed what', 'Unity Catalog (Course 4)'],
            ['system tables', 'every run, every cost', 'system.* schemas'],
          ],
        },
        {
          id: 'obs-facts',
          kind: 'list',
          icon: 'search',
          label: 'Observe the data, not only the job',
          pattern: 'service',
          items: [
            'A green run can still publish wrong numbers',
            'So log the reconciliation every run: 11 = 6 + 1 + 1 + 3',
            'And the pipeline’s expectation counts (Course 9)',
            'Alert on a breach, not only on a failure: §7',
          ],
        },
      ],
    },
  ],
  edges: [],
}
