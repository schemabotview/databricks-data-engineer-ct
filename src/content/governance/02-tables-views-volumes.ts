import type { Section } from '../types'

export const tablesViewsVolumes: Section = {
  id: 'tables-views-volumes',
  title: 'Tables, views, volumes, and the difference between tabular and file access',
  scene: 'tables-vs-volumes',
  focus: 'securables-table',
  slide: `## Rows or files: pick the right object

**Objective:** choose between a table, a view and a volume, and name the privilege each needs.

**Model:** a **table** holds rows with a schema; a **view** is a saved query over tables; a **volume** is a governed folder of any files. Tabular objects are read by SQL name; volumes are read by path.

### Worked: the landing data, two ways in (documented, not run)
- Rows: \`SELECT count(*) FROM retail.bronze.orders\` needs \`SELECT\`
- Files: \`/Volumes/retail/bronze/landing/orders/2026-10-01.csv\` needs \`READ VOLUME\`
- Both are governed by Unity Catalog, but by **different privileges**

### Misconceptions
- **"SELECT on the table lets me read its files."** Tables and volumes are different objects
- **"A volume is a table of files."** A volume has no schema`,
  narration:
    "Now let's separate the kinds of objects, because the way you reach data decides which permission you need. A table holds rows with a schema, and you read it by its SQL name. A view is a saved query over one or more tables, and you also read it by name. A volume is a governed folder of files of any kind, such as CSV, images or JSON, and you read it by a path that starts with slash Volumes, then catalog, schema and volume name. Take the landing area of our retail example. To count rows you write a select over retail dot bronze dot orders, and that needs the select privilege. To read the raw CSV file for the first of October, you point Spark at the path under slash Volumes slash retail slash bronze slash landing, and that needs the read volume privilege. Both are governed by Unity Catalog, but by different privileges on different objects. That leads to two misconceptions. Having select on a table does not let you read files, because tables and volumes are separate objects with separate grants. And a volume is not a table of files, because it carries no schema. It is just a place for files whose structure is your business. This chapter's examples are documented, not run, so check the privilege names and path form against the current documentation. Next we ask who owns the underlying storage.",
}
