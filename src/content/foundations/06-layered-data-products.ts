import type { Section } from '../types'

export const layeredDataProducts: Section = {
  id: 'layered-data-products',
  title: 'Layered data products: bronze/silver/gold as a design pattern',
  scene: 'layered-products',
  focus: 'names-promise',
  slide: `## Layers are a design pattern

**Objective:** explain what each layer is for, and what a layer name does not guarantee.

**Model:** **bronze** keeps what arrived, **silver** makes it trustworthy, **gold** answers one business question.

### Worked: the same 8 rows
- \`bronze_orders\`: **8** raw rows, every column text
- \`silver_orders\`: **6** typed rows. o4's identical resend is merged and o7 is rejected
- \`gold_sales\`: **3** rows of completed sales, 65.00 + 15.00 + 80.00 = **160.00**
- **8 = 6 + 1 resend + 1 rejected**, so every row is accounted for

### What the names do not promise
- Calling a table silver guarantees **nothing**. Atomic writes come from Delta, access from governance, correct rules from the job
- Not every flow needs three layers`,
  narration:
    "The last idea in this chapter is how to organise the work. A common design is to build data in layers, usually called bronze, silver and gold. Bronze keeps what arrived, close to the source. Silver makes it trustworthy, with proper types and no duplicates. Gold answers one business question. Let's run our eight orders through all three, using a local run. Bronze holds eight raw rows, and every column is text. To build silver, I cast the store and amount to real types, keep one copy of each identical row, and refuse rows whose amount cannot be read as a decimal. Order four was resent with identical values, so it is merged. Order seven has the amount n slash a, so it is rejected. Silver has six rows. Gold takes the completed silver orders and sums them per store. Store seven has two orders totalling sixty five. Store nine has one, fifteen. Store twelve has one, eighty. Gold has three rows, and the total is one hundred and sixty. Now reconcile, because a pipeline you cannot reconcile is a pipeline you cannot trust. Eight rows in bronze equals six in silver, plus one resend, plus one rejected row. Every row is accounted for. Here is the caution that matters. A name like silver guarantees nothing by itself. Atomic writes come from Delta. Who may read comes from governance. Whether the rules are right comes from the job that wrote the table. And not every flow needs three layers. Use the pattern where it helps. The flow now needs named data objects and authorised access, so next we establish governance before ingestion.",
}
