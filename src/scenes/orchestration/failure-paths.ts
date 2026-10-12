import type { Scene } from '@graphlearning/flow'

// §8.4 — dependency conditions and what a failed task does to its neighbours. The "run if" list is
// DOCUMENTED. The status trace is from the LOCAL MODEL of those semantics (scripts/verify/
// ch08_orchestration_model.py), where transform fails once: validate and publish are skipped, and an
// alert task that runs on "at least one failed" still runs.
export const failurePaths: Scene = {
  id: 'failure-paths',
  title: 'Dependencies, conditions and a failure path',
  flow: 'TB',
  nodes: [
    {
      id: 'status-trace',
      kind: 'table',
      label: 'One run where transform fails',
      sub: 'local model of the documented rules',
      headers: ['Task', 'Run if', 'Status'],
      values: [
        ['ingest', 'all succeeded', 'SUCCEEDED'],
        ['transform', 'all succeeded', 'FAILED'],
        ['validate', 'all succeeded', 'SKIPPED'],
        ['publish', 'all succeeded', 'SKIPPED'],
        ['alert', 'at least one failed', 'SUCCEEDED'],
      ],
    },
    {
      id: 'run-if-list',
      kind: 'list',
      label: 'Dependency conditions (documented)',
      items: [
        'all succeeded (the default)',
        'at least one succeeded, none failed',
        'all done, at least one failed, all failed',
        'if/else and for-each are task types',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'status-trace', target: 'run-if-list' }],
}
