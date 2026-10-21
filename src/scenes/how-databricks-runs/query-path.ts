import type { Scene, SceneNode } from '@graphlearning/flow'

// A Unity Catalog read, DOCUMENTED (UC and credential-vending docs, via search summaries): the
// compute asks UC to resolve the name, UC checks USE CATALOG / USE SCHEMA / SELECT, returns the
// table's location with a short-lived credential scoped to it, and the compute reads the files. The
// local column is a real run (scripts/verify/c02_how_databricks_runs.py); the error texts are copied
// from it.
const step = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon, pattern })

const LOCAL = [
  '# local session: one catalog, spark_catalog',
  'spark.sql("SHOW CATALOGS")          # spark_catalog',
  'spark.table("silver.orders")        # 1 row — two-part name',
  '# location: .verify-warehouse-c02/silver.db/orders',
  '',
  'spark.sql("SELECT * FROM retail.silver.orders")',
  '# [REQUIRES_SINGLE_PART_NAMESPACE] spark_catalog',
  '# requires a single-part namespace, but got',
  '# `retail`.`silver`.',
  '',
  'spark.sql("GRANT SELECT ON TABLE silver.orders TO `finance`")',
  '# [INVALID_STATEMENT_OR_CLAUSE] The statement or',
  '# clause: GRANT is not valid.',
].join('\n')

export const queryPath: Scene = {
  id: 'query-path',
  framed: true,
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'platform',
      label: 'On the platform (documented, not run)',
      sub: 'SELECT * FROM retail.silver.orders',
      pattern: 'network',
      icon: 'cloud',
      flow: 'LR',
      children: [
        step('q', '1 · The query', 'catalog.schema.table — retail.silver.orders', 'code', 'service'),
        step('uc', '2 · Unity Catalog resolves the name', 'and checks USE CATALOG, USE SCHEMA, SELECT for this user', 'shieldcheck', 'network'),
        step('cred', '3 · A location and a short-lived credential', 'scoped to that table’s files only', 'key', 'network'),
        step('files', '4 · The compute reads the files', 'from your bucket, with that credential', 'harddrive', 'storage'),
      ],
      edges: [
        { source: 'q', target: 'uc' },
        { source: 'uc', target: 'cred' },
        { source: 'cred', target: 'files' },
      ],
    },
    {
      id: 'right',
      label: 'Locally',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        { id: 'local', kind: 'code', filename: 'the same names, locally — run', label: LOCAL },
        {
          id: 'diff',
          kind: 'table',
          label: 'Where each answer comes from',
          headers: ['question', 'platform', 'locally'],
          values: [
            ['which table is this name?', 'Unity Catalog', 'spark_catalog'],
            ['may this user read it?', 'grants in UC', 'nobody asks'],
            ['where are its files?', 'UC, with a credential', 'the warehouse folder'],
          ],
        },
      ],
    },
  ],
  edges: [],
}
