import type { Section } from '../types'

export const workedSilverGoldFlow: Section = {
  id: 'worked-silver-gold-flow',
  title: 'Worked silver/gold flow: order detail, customer attributes, and sales summaries',
  scene: 'silver-gold-flow',
  focus: 'detail-summary',
  slide: `## The whole flow, reconciled

**Objective:** follow 11 raw events to a 3-row summary and prove the numbers agree.

**Model:** bronze keeps everything. Silver validates, types and de-duplicates to one row per order. Gold joins reference attributes and summarises.

### Worked (local run)
- **11** bronze rows, **3** quarantined, **6** silver orders
- Silver COMPLETED detail: **5** orders, **170.00**
- Gold summary: **5** orders, **170.00**. Detail equals summary
- Chapter 1's gold total was **160.00**; o6 completed later, so **+10.00**

### Reading the numbers
- The **3** quarantined rows are not lost; they wait for a fix
- Each layer's count is explained by the layer before it

### Habits this flow used
- Typed columns, rules with reasons, a total-order dedupe
- A unique reference key, and a reconciliation at each hop`,
  narration:
    "Let's run the whole flow once, with all the habits from this chapter. We start with eleven raw event rows in bronze, as text. Three fail the quality rules and are quarantined. The rest are typed and deduplicated by keeping the latest event per order, with a tie breaker, and that leaves six silver orders. In silver, five of those orders are completed, and their amounts add up to one hundred and seventy. Gold joins them to the store reference table, which has a unique key, and summarises per store. Gold has five orders and one hundred and seventy dollars. So detail equals summary, which is the reconciliation that tells you the join and the grouping did not lose or duplicate anything. You may remember that chapter one ended with a gold total of one hundred and sixty. The difference is ten dollars. In chapter one, order six was still pending. Here, a later event completed it, and that is what the latest per order logic picked up. This reference to customer attributes in the plan's title is covered by the store reference join, since our retail sample carries stores rather than customers. The three quarantined rows are not lost, they wait for a fix, and every layer's count is explained by the layer before it. The habits to keep are typed columns, rules with reasons, a total order for deduplication, unique keys on reference data, and a reconciliation at every hop. Batch transformations now define the intended results. Next we explain how those results stay correct as events and source records change.",
}
