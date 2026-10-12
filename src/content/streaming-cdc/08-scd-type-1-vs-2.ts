import type { Section } from '../types'

export const scdType1Vs2: Section = {
  id: 'scd-type-1-vs-2',
  title: 'SCD type 1 versus type 2 and historical correctness',
  scene: 'scd-types',
  focus: 'scd2-table',
  slide: `## Latest only, or the whole story

**Objective:** pick type 1 or type 2 for a table, and read a type 2 history.

**Model:** **type 1** overwrites: one current row per key, history lost. **Type 2** keeps every version with a **start** and **end**, so you can answer "what was true then?"

### Worked: the same seven distinct events (local run)
- Type 1: o1 \`45.00 COMPLETED\`, o2 \`25.00 COMPLETED\`. o3 is gone
- Type 2 gives o1 **three** versions, o2 **two**, and o3 **one**, closed at its delete
- The history is built by **sequence**, so arrival order cannot scramble it

### The cost of type 2
- More rows: **6** history rows for 3 orders
- A query must pick the version valid at the time it asks about

### Choosing
- Type 1 for a current view; type 2 when past values must stay correct`,
  narration:
    "Once changes are applied correctly, you decide what to keep. The two classic answers are called slowly changing dimension type one and type two. Type one overwrites. You keep one current row per key, and history is lost. Type two keeps every version of a row, each with a start and an end, so you can answer what was true at some earlier point. Take the same events from the last section, deduplicated to seven distinct records. As type one, we keep the newest non deleted row per order. Order one is forty five dollars and completed, order two is twenty five and completed, and order three is gone. As type two, order one has three versions, pending at sequence one, pending with the new amount at sequence two, and completed from sequence three, which is still open. Order two has two versions. Order three has one version, which ends at sequence two where it was deleted. A delete closes the previous version and is not a version itself. Notice how the history is built. We order each key's events by sequence, and each version ends where the next begins, so the order in which records arrived cannot scramble it. Type two has a cost: six history rows for three orders, and queries that must pick the version valid at the time they ask about. Use type one when you only need the current view. Use type two when past values must stay correct, for example reporting last quarter's figures as they were. Chapter seven shows how declarative pipelines express these. Next we compare this with the table's own change feed.",
}
