import type { Scene } from '@graphlearning/flow'
import yml from '../../../spine/operate/07-objectives/project/databricks.yml?raw'

// databricks.yml — Declarative Automation Bundles (once Databricks Asset Bundles), DOCUMENTED and not
// validated: `databricks bundle validate` needs a workspace (field names via search summaries:
// bundle, include, artifacts, variables, targets, mode development|production, run_as, permissions).
export const bundles: Scene = {
  id: 'operate-bundles',
  framed: true,
  padding: 0.03,
  flow: 'LR',
  align: 'start',
  nodes: [
    { id: 'bundle-yml', kind: 'code', filename: 'databricks.yml — documented, not validated', label: yml, show: [[4, 27], [33, 41]], highlight: [4, 7, 10, 16, 20, 22, 34, 37, 39] },
    {
      id: 'bundle-right',
      label: 'bundle-right',
      bare: true,
      children: [
        {
          id: 'declares',
          kind: 'table',
          label: 'What the bundle declares (documented)',
          headers: ['part', 'says'],
          values: [
            ['include', 'the job (Course 10), the pipeline (Course 9)'],
            ['artifacts', 'build the wheel (§2) before deploying'],
            ['variables', 'the catalog, per target'],
            ['targets', 'dev, staging, prod: where it deploys'],
            ['mode', 'development: per-user names, paused schedules'],
            ['run_as, permissions', 'who runs it, who may see it'],
          ],
        },
        {
          id: 'bundle-facts',
          kind: 'list',
          icon: 'package',
          label: 'Deployment intent, in the repository',
          pattern: 'service',
          items: [
            'The project, its jobs and pipelines: one folder, one commit',
            'validate checks it, deploy puts it in a workspace',
            'The same files deploy to every target',
            'Not validated here: re-check every field before use',
          ],
        },
      ],
    },
  ],
  edges: [],
}
