import type { Scene } from '@graphlearning/flow'

// §2.3 — who owns the files. DOCUMENTED, NOT EXECUTED. The 7-day figure is the documented recovery
// window for a dropped MANAGED table; re-verify it against the current docs before publishing. The
// bucket `acme-partner` is fictional.
export const managedVsExternal: Scene = {
  id: 'managed-vs-external',
  title: 'Managed and external tables',
  flow: 'TB',
  nodes: [
    {
      id: 'ownership-table',
      kind: 'table',
      label: 'Managed vs external',
      sub: 'who is responsible for what',
      headers: ['', 'Managed', 'External'],
      values: [
        ['Files live', 'UC-managed storage', 'your own path'],
        ['Lifecycle', 'Unity Catalog', 'you'],
        ['DROP TABLE', 'files removed later', 'metadata only'],
      ],
    },
    {
      id: 'create-both',
      kind: 'code',
      filename: 'create.sql  (documented, not run)',
      label: `-- managed: no LOCATION
CREATE TABLE retail.silver.orders (
  order_id STRING, store_id INT,
  amount DECIMAL(10,2), status STRING);

-- external: you name the path
CREATE TABLE retail.bronze.partner_feed
  LOCATION 's3://acme-partner/feed/';`,
    },
  ],
  edges: [{ source: 'ownership-table', target: 'create-both' }],
}
