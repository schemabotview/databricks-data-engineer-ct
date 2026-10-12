import type { Scene } from '@graphlearning/flow'

// §9.2 — a Spark UI number, read from the monitoring REST API of a LOCAL run: the records each of the four
// tasks of a shuffle stage read when 80% of the orders belong to one store. The SQL query profile on
// Databricks shows similar per-operator rows and time; it is documented, not run.
export const stageMetrics: Scene = {
  id: 'stage-metrics',
  title: 'One slow task, read from the UI numbers',
  flow: 'TB',
  nodes: [
    {
      id: 'task-quantiles',
      kind: 'table',
      label: 'Records read per task, one stage',
      sub: 'REST taskSummary, local run',
      headers: ['Quantile', 'Records read'],
      values: [
        ['minimum', '36,115'],
        ['25%', '43,880'],
        ['median', '64,525'],
        ['75%', '855,480'],
        ['maximum', '855,480'],
      ],
    },
    {
      id: 'rest-call',
      kind: 'code',
      filename: 'monitoring REST API  (local run)',
      label: `GET /api/v1/applications/<app>/stages
  /<stageId>/0/taskSummary
  ?quantiles=0.0,0.25,0.5,0.75,1.0

-> shuffleReadMetrics.readRecords`,
    },
    {
      id: 'skew-reading',
      kind: 'list',
      label: 'Reading it',
      items: ['max 855,480 against median 64,525', 'one task does 13x the median work', 'equal quantiles would mean even work'],
      framed: true,
    },
  ],
  edges: [
    { source: 'task-quantiles', target: 'rest-call' },
    { source: 'rest-call', target: 'skew-reading' },
  ],
}
