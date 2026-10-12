import type { Section } from '../types'

export const discoveryLineageAudit: Section = {
  id: 'discovery-lineage-audit',
  title: 'Discovery, metadata, lineage, and audit evidence',
  scene: 'lineage-audit',
  focus: 'lineage-result',
  slide: `## Governance you can look up

**Objective:** find what feeds a table and who touched it, without asking anyone.

**Model:** Unity Catalog records **metadata** (names, comments, tags), **lineage** (which objects fed which) and **audit** events. These are visible in Catalog Explorer and, where enabled, in **system tables**.

### Worked: what fed gold.sales (documented, not run)
- Chain: landing volume, then \`bronze.orders\`, then \`silver.orders\`, then \`gold.sales\`
- A \`system.access.table_lineage\` query returns the upstream table
- The result row shown is **illustrative**, not a real run

### Caveats
- System tables must be enabled, and column names should be re-checked
- Lineage shows what ran, not whether the logic was correct`,
  narration:
    "Governance is not only about saying no. It is also about being able to look things up. Unity Catalog records three kinds of evidence. Metadata is the names, comments and tags that help people discover data. Lineage records which objects fed which. And audit records events, such as who accessed what. You can browse these in Catalog Explorer, and where they are enabled you can query them through system tables. Take our gold sales table. Its chain starts at the landing volume, flows into bronze orders, then silver orders, then gold sales. A query against the table lineage system table, filtering on gold sales as the target, returns its source tables. In our case that is silver orders. I want to be honest that the result row on this board is illustrative. It is not from a real run, since no workspace was available. Two caveats matter. System tables have to be enabled, and the exact column names should be checked against the current documentation. And lineage tells you what ran, not whether the logic was right. A table can have perfect lineage and still be wrong. Audit records matter for a different reason. When something goes wrong, they are the evidence of who did what and when. Next we compare ways of reaching data that lives elsewhere.",
}
