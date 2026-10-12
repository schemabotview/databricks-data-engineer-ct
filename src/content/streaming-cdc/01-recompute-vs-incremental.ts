import type { Section } from '../types'

export const recomputeVsIncremental: Section = {
  id: 'recompute-vs-incremental',
  title: 'Full recomputation, incremental processing, and append-only assumptions',
  scene: 'recompute-vs-incremental',
  focus: 'rows-read-table',
  slide: `## Recompute, or process only what is new

**Objective:** choose between recomputing a result and updating it, and state what the second assumes.

**Model:** **full recomputation** re-reads all input each time: simple, and always consistent with the source. **Incremental** processing reads only new input and keeps **state** to combine it with what came before.

### Worked: four files of orders (local run)
- Files hold 3, 3, 2 and 2 rows
- Recomputing after each file reads **3, 6, 8, 10**: **27** rows in all
- Incremental reads **3, 3, 2, 2**: **10** rows

### What incremental assumes
- New data arrives as **new rows**, and old rows **never change**
- Late rows have a plan, and a restart knows where it stopped
- This chapter tests each assumption`,
  narration:
    "Every pipeline answers a question at some point in time, and there are two basic ways to keep the answer current. You can recompute everything from scratch each time, or you can process only what is new and combine it with what you already know. Full recomputation is simple, and it is always consistent with the source, because it looks at everything. Incremental processing reads only new input, and keeps state so it can combine it with earlier results. Here is the difference in a local run with four files of order events, holding three, three, two and two rows. If we recompute after each file, we read three rows, then six, then eight, then ten, which is twenty seven row reads in total. Incrementally, we read three, three, two and two, which is ten. The saving grows as the history grows. But incremental processing quietly assumes things that recomputation does not. It assumes new data arrives as new rows. It assumes old rows never change. It assumes late rows have a plan, and that after a restart the query knows where it stopped. Real data breaks each of those. Orders get resent, updated and deleted, and events arrive late. So this chapter tests those assumptions one at a time, with real runs. Next we start with time, and what late data means.",
}
