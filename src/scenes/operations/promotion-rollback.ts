import type { Scene } from '@graphlearning/flow'

// §10.5 — environments as bundle targets and a promotion path. DOCUMENTED, NOT RUN. Development mode is
// documented to prefix resource names with the deployer and mark them as development; production mode adds
// deploy-time checks (including that the Git branch matches the target) and recommends running as a
// service principal. The CI steps are a SKETCH of a pipeline, not a validated one.
export const promotionRollback: Scene = {
  id: 'promotion-rollback',
  title: 'dev, staging, prod, and the way back',
  flow: 'TB',
  nodes: [
    {
      id: 'target-table',
      kind: 'table',
      label: 'Targets',
      sub: 'documented, not run',
      headers: ['Target', 'Mode', 'Runs as'],
      values: [
        ['dev', 'development', 'the developer'],
        ['staging', 'default', 'a service principal'],
        ['prod', 'production', 'a service principal'],
      ],
    },
    {
      id: 'ci-sketch',
      kind: 'code',
      filename: 'ci.yml  (sketch, not run)',
      label: `on pull request:
  pytest
  databricks bundle validate -t staging
on push to main:
  databricks bundle deploy -t staging
  databricks bundle run retail_daily -t staging
  databricks bundle deploy -t prod`,
    },
    {
      id: 'rollback-list',
      kind: 'list',
      label: 'Rolling back',
      items: [
        'redeploy the previous commit',
        'code rolls back; data does not',
        'a bad write needs its own recovery',
      ],
      framed: true,
    },
  ],
  edges: [
    { source: 'target-table', target: 'ci-sketch' },
    { source: 'ci-sketch', target: 'rollback-list' },
  ],
}
