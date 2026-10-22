import type { Scene } from '@graphlearning/flow'

// Jobs, pipelines or managed ingestion — DOCUMENTED comparison drawn from Courses 6, 9 and 10.
export const platforms: Scene = {
  id: 'defend-platforms',
  framed: true,
  padding: 0.03,
  align: 'start',
  nodes: [
    {
      id: 'choices',
      kind: 'table',
      label: 'Three ways to run the same flow (documented)',
      headers: ['', 'job + our code', 'declarative pipeline', 'managed ingestion'],
      values: [
        ['what you write', 'the steps and their order', 'datasets and expectations', 'a connection and options'],
        ['incremental reads', 'our checkpoints (Course 6)', 'its streaming tables', 'the connector'],
        ['data quality', 'our rules, our quarantine', 'expectations (Course 9)', 'yours, afterwards'],
        ['changes (CDC)', 'cdc.py (Course 8)', 'AUTO CDC', 'often built in'],
        ['retries, repair', 'Jobs (Course 10)', 'the update', 'the connector'],
        ['tested locally', 'yes: 7 tests (Course 12)', 'the Spark inside, not the pipeline', 'no'],
        ['left to you', 'everything', 'the decisions, not the plumbing', 'the source contract, quality'],
      ],
    },
    {
      id: 'plat-below',
      label: 'plat-below',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'when',
          kind: 'list',
          icon: 'scale',
          label: 'Choosing',
          pattern: 'service',
          items: [
            'A supported source: try managed ingestion for bronze',
            'Standard bronze → silver → gold: a pipeline',
            'Unusual logic, or local tests first: a job + code',
            'Mixing is normal: a job can run a pipeline as a task',
          ],
        },
        {
          id: 'never',
          kind: 'list',
          icon: 'ban',
          label: 'No choice removes',
          pattern: 'warn',
          items: [
            'The key, the sequence and the grain',
            'The reconciliation readers can check',
            'Retention long enough to recover',
            'An owner for every table',
          ],
        },
      ],
    },
  ],
  edges: [],
}
