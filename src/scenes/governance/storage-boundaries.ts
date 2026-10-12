import type { Scene } from '@graphlearning/flow'

// §2.5 — three independent controls, and the storage credential / external location pair that joins
// Unity Catalog to cloud storage. DOCUMENTED, NOT EXECUTED; `partner_role` and the bucket are
// fictional. A storage credential is typically created in Catalog Explorer or through the API from an
// IAM role, so it is not drawn as SQL.
export const storageBoundaries: Scene = {
  id: 'storage-boundaries',
  title: 'Workspace, Unity Catalog and cloud: three controls',
  flow: 'TB',
  nodes: [
    {
      id: 'three-controls',
      kind: 'table',
      label: 'Three controls, checked separately',
      sub: 'each can say no',
      headers: ['Control', 'Decides'],
      values: [
        ['Workspace', 'who may open and run'],
        ['Unity Catalog', 'who may read objects'],
        ['Cloud IAM', 'what the role can reach'],
      ],
    },
    {
      id: 'credential-chain',
      label: 'How access reaches the files',
      pattern: 'group',
      flow: 'LR',
      children: [
        { id: 'iam-role', label: 'IAM role', sub: 'in your cloud account', pattern: 'external', icon: 'lock' },
        { id: 'storage-credential', label: 'Storage credential', sub: 'wraps the role', pattern: 'service', icon: 'shield' },
        { id: 'external-location', label: 'External location', sub: 'credential + path', pattern: 'storage', icon: 'folder' },
      ],
      edges: [
        { source: 'iam-role', target: 'storage-credential' },
        { source: 'storage-credential', target: 'external-location' },
      ],
    },
    {
      id: 'location-sql',
      kind: 'code',
      filename: 'location.sql  (documented, not run)',
      label: `CREATE EXTERNAL LOCATION partner_feed
  URL 's3://acme-partner/feed/'
  WITH (STORAGE CREDENTIAL partner_role);

GRANT READ FILES
  ON EXTERNAL LOCATION partner_feed
  TO \`data_engineers\`;`,
    },
  ],
  edges: [
    { source: 'three-controls', target: 'credential-chain' },
    { source: 'credential-chain', target: 'location-sql' },
  ],
}
