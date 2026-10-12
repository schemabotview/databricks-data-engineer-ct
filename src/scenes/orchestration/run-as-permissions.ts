import type { Scene } from '@graphlearning/flow'

// §8.6 — a job's tasks run as one identity, and that identity needs the privileges. Run-as is DOCUMENTED,
// NOT RUN (a job can run as a user or a service principal; this was not confirmed by the search
// summaries — re-verify). The refusal is derived from the Chapter 2 permission MODEL
// (scripts/verify/ch02_governance_model.py): etl_runner may read bronze and write silver, and has no grant
// on gold. The error text is the SHAPE of a denial, paraphrased.
export const runAsPermissions: Scene = {
  id: 'run-as-permissions',
  title: 'The job runs as one identity',
  flow: 'TB',
  nodes: [
    {
      id: 'run-as-table',
      kind: 'table',
      label: 'Run as etl_runner',
      sub: 'from the Chapter 2 grants',
      headers: ['Task', 'Needs', 'Result'],
      values: [
        ['ingest', 'write bronze', 'allowed'],
        ['transform', 'read bronze, write silver', 'allowed'],
        ['publish', 'write gold', 'refused'],
      ],
    },
    {
      id: 'run-as-fix',
      kind: 'code',
      filename: 'denial and fix  (illustrative)',
      label: `-- publish task, running as etl_runner
INSUFFICIENT_PERMISSIONS: no USE SCHEMA
  on retail.gold

GRANT USE SCHEMA, MODIFY
  ON SCHEMA retail.gold TO \`etl_runner\`;`,
    },
    {
      id: 'identity-list',
      kind: 'list',
      label: 'Identity rules of thumb',
      items: [
        'run as a service principal, not a person',
        'grant the principal the least it needs',
        'a person clicking run does not change it',
      ],
      framed: true,
    },
  ],
  edges: [
    { source: 'run-as-table', target: 'run-as-fix' },
    { source: 'run-as-fix', target: 'identity-list' },
  ],
}
