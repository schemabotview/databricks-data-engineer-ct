import type { Scene, SceneNode } from '@graphlearning/flow'

// The Unity Catalog object tree for the retail example (DOCUMENTED: Unity Catalog object model, via
// search summaries; `retail`, `retail_dev` and the schemas are the course's names), beside how the same
// names are written locally — the two-part names Course 3 created, which are real.
const node = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon, pattern })
const obj = (id: string, label: string, icon: string): SceneNode => ({ id, label, variant: 'chip', icon, pattern: 'storage' })

const NAMES = [
  '-- fully qualified: catalog.schema.object',
  'SELECT * FROM retail.silver.orders;',
  '',
  '-- or set defaults for the session, then one part',
  'USE CATALOG retail;',
  'USE SCHEMA silver;',
  'SELECT * FROM orders;',
  '',
  '-- the same table in development',
  'SELECT * FROM retail_dev.silver.orders;',
].join('\n')

export const names: Scene = {
  id: 'uc-names',
  framed: true,
  padding: 0.04,
  nodes: [
    {
      id: 'tree',
      label: 'One metastore, three parts to every name (documented, not run)',
      pattern: 'network',
      icon: 'none',
      flow: 'LR',
      align: 'start',
      children: [
        node('metastore', 'Metastore', 'eu-west-1: the region’s root, holding every catalog', 'database', 'network'),
        {
          id: 'catalogs',
          label: '1 · catalog',
          bare: true,
          cols: 1,
          children: [
            node('cat-prod', 'retail', 'production data', 'layers', 'service'),
            node('cat-dev', 'retail_dev', 'the same shape, for building', 'layers', 'service'),
          ],
        },
        {
          id: 'schemas',
          label: '2 · schema',
          bare: true,
          cols: 1,
          children: [
            node('s-bronze', 'bronze', 'what arrived', 'database', 'storage'),
            node('s-silver', 'silver', 'typed, deduplicated', 'funnel', 'storage'),
            node('s-gold', 'gold', 'business answers', 'sigma', 'storage'),
          ],
        },
        {
          id: 'objects',
          label: '3 · object',
          bare: true,
          cols: 1,
          children: [obj('o-orders', 'orders — table', 'table'), obj('o-landing', 'landing — volume', 'folder'), obj('o-sales', 'sales — table', 'table'), obj('o-view', 'store_sales — view', 'search')],
        },
      ],
      edges: [
        { source: 'metastore', target: 'catalogs' },
        { source: 'catalogs', target: 'schemas' },
        { source: 'schemas', target: 'objects' },
      ],
    },
    {
      id: 'below',
      label: 'Writing the names',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        { id: 'names-sql', kind: 'code', filename: 'names.sql — documented, not run', label: NAMES },
        {
          id: 'local',
          kind: 'table',
          label: 'The same tables, as this course runs them',
          headers: ['on the platform', 'locally (run)'],
          values: [
            ['retail.bronze.orders', 'bronze.orders'],
            ['retail.silver.orders', 'silver.orders'],
            ['retail.gold.sales', 'gold.sales'],
            ['catalog: Unity Catalog', 'spark_catalog + Derby'],
          ],
        },
      ],
    },
  ],
  edges: [],
}
