import type { Section } from '../types'

export const sharingVsFederation: Section = {
  id: 'sharing-vs-federation',
  title: 'Sharing versus federation: copying, querying, access, and cost trade-offs',
  scene: 'share-vs-federate',
  focus: 'approach-table',
  slide: `## Copy, share or query in place

**Objective:** compare ingesting, sharing and federating, and say what each trades.

**Model:** **ingest** copies data into your tables. **Delta Sharing** gives read access to a provider's data without a copy. **Lakehouse Federation** lets you query an external database in place.

### Worked: three ways to reach a partner's orders (documented, not run)
- Ingest: fresh as of the last load; you pay storage and load compute
- Sharing: live from the provider; the recipient's compute runs the query
- Federation: live from the source, which carries the query load

### Misconceptions
- **"No copy means no cost."** Compute, source load and cross-region transfer can still cost
- **"Federation replaces ingestion."** A busy source may not tolerate the queries`,
  narration:
    "The last question in this chapter is what to do when the data you need belongs to someone else, or lives in another system. There are three broad answers. You can ingest it, which copies it into your own tables. You can use Delta Sharing, which gives you read access to a provider's data without copying it. Or you can use Lakehouse Federation, which lets you query an external database in place, through Unity Catalog. Suppose a partner has the orders we want. If we ingest, the data is as fresh as our last load, and we pay for storage and the loading compute. If the partner shares it with us, we read their live data, and our own compute runs the query. If we federate to their database, we read live from the source, and the source system carries the query load. So choose by asking four things. How fresh must it be? Who pays to read it? May the data leave where it lives? And how much load can the source take? Two misconceptions follow. No copy does not mean no cost, because compute, source load and, across regions or clouds, data transfer can all add up. And federation does not replace ingestion, because a busy operational database may not tolerate analytical queries. This is a comparison, with no prices quoted, and it is documented, not run. Governance defines who can access data. Next we explain the table semantics that make changes reliable.",
}
