import type { Scene } from '@graphlearning/flow'

// §2.1 — the Unity Catalog object tree for the retail example, and the same table reached by a fully
// qualified name and by a session default. DOCUMENTED, NOT EXECUTED: no Unity Catalog metastore was
// available while authoring. `retail` and its schemas are the course's illustrative names.
export const ucHierarchy: Scene = {
  id: 'uc-hierarchy',
  title: 'Metastore, catalog, schema, object',
  flow: 'TB',
  nodes: [
    {
      id: 'object-tree',
      label: 'One metastore, three levels of names',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'metastore-node', label: 'Metastore', sub: 'regional metadata root', pattern: 'service', icon: 'database' },
        { id: 'catalog-node', label: 'Catalog: retail', sub: 'first name part', pattern: 'service', icon: 'folder' },
        { id: 'schema-bronze', label: 'Schema: bronze', sub: 'raw objects', pattern: 'storage', icon: 'folder' },
        { id: 'schema-silver', label: 'Schema: silver', sub: 'typed objects', pattern: 'storage', icon: 'folder' },
        { id: 'schema-gold', label: 'Schema: gold', sub: 'business objects', pattern: 'storage', icon: 'folder' },
      ],
      edges: [
        { source: 'metastore-node', target: 'catalog-node' },
        { source: 'catalog-node', target: 'schema-bronze' },
        { source: 'catalog-node', target: 'schema-silver' },
        { source: 'catalog-node', target: 'schema-gold' },
      ],
    },
    {
      id: 'qualified-names',
      kind: 'code',
      filename: 'names.sql  (documented, not run)',
      label: `-- fully qualified: catalog.schema.object
SELECT * FROM retail.silver.orders;

-- same table through session defaults
USE CATALOG retail;
USE SCHEMA silver;
SELECT * FROM orders;`,
    },
  ],
  edges: [{ source: 'object-tree', target: 'qualified-names' }],
}
