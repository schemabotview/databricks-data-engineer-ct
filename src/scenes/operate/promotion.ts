import type { Scene, SceneNode } from '@graphlearning/flow'
import ci from '../../../spine/operate/07-objectives/project/.github/workflows/deploy.yml?raw'

// Targets, CI and promotion — a SKETCH, not run (.github/workflows/deploy.yml; `databricks bundle
// validate|deploy -t <target>`, OAuth for a service principal: documented via search summaries; the CI
// steps are unverified). Rollback is redeploying an earlier commit.
const env = (id: string, label: string, sub: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon: 'cloud', pattern })

export const promotion: Scene = {
  id: 'operate-promotion',
  framed: true,
  padding: 0.03,
  align: 'start',
  nodes: [
    {
      id: 'path',
      label: 'One commit, promoted (documented)',
      pattern: 'network',
      icon: 'gitbranch',
      flow: 'LR',
      children: [
        env('dev', 'dev', 'each engineer, per-user names', 'network'),
        env('ci', 'CI', 'tests, validate, deploy to staging', 'service'),
        env('staging', 'staging', 'a copy of prod, its own catalog', 'network'),
        env('prod', 'prod', 'runs as retail-job', 'storage'),
      ],
      edges: [
        { source: 'dev', target: 'ci', label: 'push' },
        { source: 'ci', target: 'staging', label: 'deploy' },
        { source: 'staging', target: 'prod', label: 'approve' },
      ],
    },
    {
      id: 'promo-below',
      label: 'promo-below',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        { id: 'ci-yml', kind: 'code', filename: '.github/workflows/deploy.yml — a sketch, not run', label: ci, highlight: [9, 19, 21, 22] },
        {
          id: 'rollback',
          kind: 'list',
          icon: 'repeat',
          label: 'Rolling back',
          pattern: 'warn',
          items: [
            'Code: deploy the previous commit again',
            'Data: a code rollback does not undo writes',
            'Delta RESTORE for a bad table (Course 5)',
            'A rebuilt silver or gold, from bronze',
            'Promote nothing that skipped staging',
          ],
        },
      ],
    },
  ],
  edges: [],
}
