import type { Scene, SceneNode } from '@graphlearning/flow'

// Three controls, and the IAM role → storage credential → external location chain (DOCUMENTED: Unity
// Catalog storage docs for AWS, via search summaries). `acme-partner`, `partner_role` and the bucket
// are fictional. A storage credential is created from an IAM role in Catalog Explorer or the API, so it
// is not drawn as SQL.
const step = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon, pattern })

const LOCATION = [
  '-- the path, and the credential that may reach it',
  'CREATE EXTERNAL LOCATION partner_feed',
  "  URL 's3://acme-partner/feed/'",
  '  WITH (STORAGE CREDENTIAL partner_role);',
  '',
  '-- who may list and read files there',
  'GRANT READ FILES ON EXTERNAL LOCATION partner_feed',
  '  TO `data-engineers`;',
  '',
  '-- an external table on that path',
  'CREATE TABLE retail.bronze.partner_orders',
  "  LOCATION 's3://acme-partner/feed/orders/';",
].join('\n')

export const storage: Scene = {
  id: 'storage-locations',
  framed: true,
  padding: 0.04,
  nodes: [
    {
      id: 'chain',
      label: 'How a query reaches files it does not own (documented, not run)',
      pattern: 'network',
      icon: 'none',
      flow: 'LR',
      children: [
        step('role', 'IAM role', 'in YOUR cloud account; it can read the bucket', 'lock', 'external'),
        step('cred', 'Storage credential', 'Unity Catalog’s handle on that role', 'key', 'service'),
        step('loc', 'External location', 'one credential + one path', 'folder', 'storage'),
        step('table', 'External table or volume', 'created on that path, then granted', 'table', 'storage'),
      ],
      edges: [
        { source: 'role', target: 'cred' },
        { source: 'cred', target: 'loc' },
        { source: 'loc', target: 'table' },
      ],
    },
    {
      id: 'below',
      label: 'Controls',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        { id: 'location-sql', kind: 'code', filename: 'location.sql — documented, not run', label: LOCATION },
        {
          id: 'right',
          label: 'Three controls',
          bare: true,
          children: [
            {
              id: 'controls',
              kind: 'table',
              label: 'Three controls, each can say no',
              headers: ['control', 'decides'],
              values: [
                ['workspace', 'who may log in and run'],
                ['Unity Catalog', 'who may use which object'],
                ['cloud IAM', 'what the role can reach'],
              ],
            },
            {
              id: 'storage-facts',
              kind: 'list',
              icon: 'shieldcheck',
              label: 'Why the chain exists',
              pattern: 'warn',
              items: [
                'Users never hold cloud keys',
                'One role per location, not per person',
                'Revoke in UC, and the path is closed',
              ],
            },
          ],
        },
      ],
    },
  ],
  edges: [],
}
