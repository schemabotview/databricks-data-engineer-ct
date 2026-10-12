import type { Section } from '../types'

export const metastoresCatalogsSchemas: Section = {
  id: 'metastores-catalogs-schemas',
  title: 'Metastores, catalogs, schemas, and fully qualified object names',
  scene: 'uc-hierarchy',
  focus: 'catalog-node',
  slide: `## Every object has a three-part name

**Objective:** read a name like \`retail.silver.orders\` and say what each part points to.

**Model:** Unity Catalog keeps governed data in a tree. The **metastore** is the regional root of the metadata. A **catalog** is the first level beneath it, a **schema** the second, and tables, views and volumes sit inside a schema.

### Worked: the retail tree (documented, not run)
- Catalog **\`retail\`**, with schemas **\`bronze\`**, **\`silver\`**, **\`gold\`**
- Chapter 1's \`bronze_orders\` is now \`retail.bronze.orders\`
- \`USE CATALOG\` and \`USE SCHEMA\` set session defaults, so \`orders\` alone resolves to the same table

### Misconceptions
- **"The name is just a label."** It is also where grants attach and inherit
- **"Unqualified is safe."** It depends on the session's defaults, so pipelines use full names`,
  narration:
    "Before we grant anyone anything, we need names for what is being protected. In Unity Catalog, governed data lives in a tree with three levels of naming. At the root is the metastore, the regional holder of the metadata. Beneath it are catalogs, beneath those are schemas, and inside a schema sit the objects themselves: tables, views and volumes. So an object's full name has three parts, catalog, schema, object. For our retail example I use a catalog called retail, with three schemas named bronze, silver and gold. The orders table from chapter one is now retail dot bronze dot orders, and its cleaned sibling is retail dot silver dot orders. You can shorten a name by setting defaults for the session. Use catalog retail and use schema silver, and then the bare name orders resolves to the same table. That is convenient in a notebook, but it depends on the session, so pipelines and jobs should use full names. Two misconceptions to clear. A name is not just a label. It is also the place where permissions attach and flow downward, which is the subject of section four. And an unqualified name is not safe, because which table it means depends on whoever's session ran it. I should be clear about the status of this chapter. There was no Unity Catalog metastore available while authoring, so every example here is documented, not run, and the names retail, bronze and so on are illustrative. Next we separate tables, views and volumes.",
}
