import type { Scene, SceneNode } from '@graphlearning/flow'

// Databricks on AWS architecture, DOCUMENTED (docs.databricks.com/aws/en/getting-started/overview,
// checked through search summaries): the control plane in Databricks' account; the classic compute
// plane in yours; the serverless compute plane in Databricks' account, in the workspace's region; data
// and the workspace storage bucket in your cloud storage. Nothing on this frame is run.
const plane = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern'], items: string[]): SceneNode =>
  ({ id, kind: 'list', label, sub, icon, pattern, items })

export const planes: Scene = {
  id: 'platform-planes',
  framed: true,
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'row',
      label: 'Three places, two accounts (documented, not run)',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        plane('control', 'Control plane', 'in Databricks’ account', 'cloud', 'network', [
          'The web application and the REST API',
          'Workspace configuration, job definitions, schedules',
          'The cluster manager that starts your compute',
          'Unity Catalog: names, grants, lineage',
        ]),
        {
          id: 'compute',
          label: 'Compute plane — where data is processed',
          bare: true,
          children: [
            plane('classic', 'Classic compute', 'virtual machines in YOUR cloud account', 'server', 'service', [
              'Clusters and classic SQL warehouses',
              'Your network, your security groups',
              'You pay the cloud for the machines, and Databricks for its units',
            ]),
            plane('serverless', 'Serverless compute', 'in Databricks’ account, in your region', 'zap', 'service', [
              'Serverless notebooks, jobs, pipelines, SQL warehouses',
              'Started and sized by Databricks; no machines to manage',
              'One bill, from Databricks',
            ]),
          ],
        },
        plane('storage', 'Your cloud storage', 'buckets in YOUR cloud account', 'harddrive', 'storage', [
          'Every table’s files: Parquet and the Delta log',
          'Landing zones for raw files',
          'The workspace storage bucket: system data, logs, results',
          'You pay the cloud for it, and decide who can reach it',
        ]),
      ],
      edges: [
        { source: 'control', target: 'compute', label: 'starts, sends code' },
        { source: 'compute', target: 'storage', label: 'reads, writes' },
      ],
    },
    {
      id: 'below',
      label: 'Consequences',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'who',
          kind: 'table',
          label: 'Who holds what, for the retail lakehouse',
          headers: ['thing', 'lives in', 'account'],
          values: [
            ['the job definition and its schedule', 'control plane', 'Databricks'],
            ['the nightly job’s machines', 'classic or serverless compute', 'yours or Databricks’'],
            ['bronze, silver and gold files', 'your bucket', 'yours'],
            ['who may read gold', 'Unity Catalog, in the control plane', 'Databricks'],
          ],
        },
        {
          id: 'means',
          kind: 'list',
          icon: 'shieldcheck',
          label: 'What it means for you',
          pattern: 'user',
          items: [
            'Data at rest stays in storage you own and pay for',
            'Code runs where the compute is — check which plane',
            'Storage and compute are separate bills and separate decisions',
          ],
        },
      ],
    },
  ],
  edges: [],
}
