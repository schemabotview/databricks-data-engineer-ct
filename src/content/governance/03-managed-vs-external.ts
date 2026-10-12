import type { Section } from '../types'

export const managedVsExternal: Section = {
  id: 'managed-vs-external',
  title: 'Managed versus external objects: ownership and lifecycle responsibilities',
  scene: 'managed-vs-external',
  focus: 'ownership-table',
  slide: `## Who owns the files?

**Objective:** say who is responsible for a table's storage and what \`DROP\` really does.

**Model:** a **managed** table keeps its files in storage Unity Catalog manages, so the platform owns the lifecycle. An **external** table points at a path you own, so you do.

### Worked: two tables (documented, not run)
- \`retail.silver.orders\` has no \`LOCATION\`, so it is **managed**
- \`retail.bronze.partner_feed\` names an S3 path, so it is **external**
- Dropping a managed table removes its files after a recovery window, documented as 7 days
- Dropping an external table removes **metadata only**

### Why it matters
- Managed: cleanup follows Unity Catalog's rules
- External: you delete the files, or they keep costing storage

### Misconception
- **"External means ungoverned."** It is still governed, but the files outlive the table`,
  narration:
    "The next question is who is responsible for the files behind a table. There are two answers. A managed table keeps its files in storage that Unity Catalog manages, so the platform owns their lifecycle. An external table points at a path in your own cloud storage, so you own the lifecycle. You can tell them apart in the create statement. In our example, the silver orders table is created with no location, so it is managed. The partner feed table names an S3 path with a location clause, so it is external. The difference matters most when something is dropped. If you drop a managed table, Unity Catalog removes the underlying files after a recovery window, which the documentation puts at seven days, and I would re-check that number before relying on it. If you drop an external table, only the metadata goes. The files stay exactly where they were, and whoever owns that bucket still owns them. A common misconception is that external means ungoverned. It does not. The table is still governed, with grants and lineage. The difference is only that its files outlive it, and that you carry the storage responsibilities, such as retention and cleanup. So the practical question is what happens to storage after a drop. For managed tables, retention and cleanup follow Unity Catalog's rules. For external tables, you must delete the files yourself, or they stay and keep costing storage. The bucket name in this example is fictional, and the example is documented, not run. Next we look at who is allowed to do things to these objects.",
}
