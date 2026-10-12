import type { Section } from '../types'

export const dimensionalOutputsContracts: Section = {
  id: 'dimensional-outputs-contracts',
  title: 'Dimensional outputs, measures, and consumer-oriented data contracts',
  scene: 'gold-contract',
  focus: 'gold-rows',
  slide: `## A summary is a promise

**Objective:** define a gold table's grain and measures so a consumer can rely on them.

**Model:** a **dimensional output** has a declared **grain** (what one row is), **dimensions** that describe it, and **measures** that are summed or counted. A **contract** writes those down and lets the table enforce what it can.

### Worked: \`gold_sales\` (local run)
- Grain: **one row per store**
- Dimensions: \`store_id\`, \`store_name\`
- Measures: \`orders\` counts COMPLETED orders; \`sales\` sums \`amount\`
- Rows: Leeds **3 / 75.00**, York **1 / 15.00**, Hull **1 / 80.00**; total **170.00**

### Enforced and not
- Column comments and a \`CHECK (sales >= 0)\` live in the table
- A definition like "COMPLETED only" lives in the comment and the docs`,
  narration:
    "A gold table is a promise to the people who read it, so it should say exactly what it contains. The first thing to declare is the grain: what does one row represent? Here, one row per store. Next come the dimensions, which describe the row, here the store id and the store name. And then the measures, which are the numbers that get counted or summed. In our table, orders counts the completed orders, and sales sums the amount over those completed orders. Writing those definitions down is a data contract, and part of it can be enforced by the table itself. In a local run I created the gold sales table with a comment on each column, and I added a check constraint saying sales can never be negative. The result has three rows. Leeds has three orders worth seventy five. York has one, worth fifteen. Hull has one, worth eighty. The total is one hundred and seventy. Be honest about what is enforced and what is not. The check constraint is enforced. The definition that only completed orders count lives in the comment and in your documentation, and a reader has to trust it. That is why the next section reconciles the summary back to the detail. Next we assemble the whole flow.",
}
