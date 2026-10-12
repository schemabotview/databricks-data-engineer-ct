import type { Scene } from '@graphlearning/flow'

// §1.3 — where the account, the workspaces, the compute and the data sit. Compute is shown in both
// places it can run (Databricks' account for serverless, the customer's cloud account for classic);
// storage is the customer's object storage. Unity Catalog governance is Chapter 2 and only
// pointed at here.
export const platformBoundaries: Scene = {
  id: 'platform-boundaries',
  title: 'Account, workspace, compute and storage',
  flow: 'TB',
  nodes: [
    {
      id: 'account',
      label: 'Databricks account',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'workspace-dev', label: 'Workspace: dev', sub: 'notebooks, jobs, settings', pattern: 'user', icon: 'monitor' },
        { id: 'workspace-prod', label: 'Workspace: prod', sub: 'notebooks, jobs, settings', pattern: 'user', icon: 'monitor' },
      ],
    },
    {
      id: 'compute-plane',
      label: 'Where code runs',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'serverless-compute', label: 'Serverless', sub: 'Databricks-managed', pattern: 'service', icon: 'cloud' },
        { id: 'classic-compute', label: 'Classic', sub: 'in your cloud account', pattern: 'service', icon: 'server' },
      ],
    },
    {
      id: 'data-storage',
      label: 'Where data lives',
      pattern: 'group',
      cols: 1,
      children: [
        { id: 'object-storage', label: 'Object storage', sub: 'your cloud account (S3)', pattern: 'storage', icon: 'database' },
      ],
    },
  ],
  edges: [
    { source: 'account', target: 'compute-plane' },
    { source: 'compute-plane', target: 'data-storage' },
  ],
}
