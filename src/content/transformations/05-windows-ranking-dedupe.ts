import type { Section } from '../types'

export const windowsRankingDedupe: Section = {
  id: 'windows-ranking-dedupe',
  title: 'Windows, ranking, and deterministic deduplication',
  scene: 'window-dedupe',
  focus: 'rank-table',
  slide: `## Keep the latest, and decide ties

**Objective:** write a deduplication whose result does not depend on row order.

**Model:** a **window** ranks rows inside a group. \`row_number()\` over \`PARTITION BY order_id\`, ordered by event time descending, gives rank 1 to the latest event. A tied sort needs a **tie-breaker**.

### Worked: o4 and o6 (local run)
- o6 has two events: PENDING at 09:23 and COMPLETED at 09:41. The later one is **rank 1**
- o4's resend has the **same** event time as the original
- Ordering by time and then \`source_file\` keeps file **c**, every time

### Two more cautions
- For the **first** event, order ascending instead
- Filter invalid rows **before** ranking, or an invalid row can win

### Why the second key
- Without it, 12 shuffles of the same tied rows kept **different** files
- A tie decided by row order is a bug waiting for a re-run`,
  narration:
    "Events can repeat, and updates arrive as new events, so before analysis we usually keep one row per order: the latest. A window function does this. We partition the rows by order id, order them by event time, latest first, and number them with row number. Rank one is the row to keep. Look at our two examples, from a local run. Order six has two events, pending at nine twenty three and completed at nine forty one. The later one gets rank one, so we keep completed, which is the right current status. Order four is different. Its resend has exactly the same event time as the original, so they tie. If we order only by time, the database is free to choose either one, and which it chooses can depend on how the rows happen to be arranged. I tested this. I took four tied rows from four different files and shuffled their order twelve times. Ordering by time alone kept different files depending on the shuffle. Adding source file as a second sort key made it keep the same one every time, file c in our example. For identical rows the business result is the same either way, but a different row surviving can change a metadata column, and for rows that are not identical it can change the answer. Two more cautions. For the first event rather than the latest, order ascending. And filter invalid rows before ranking, or an invalid row could take rank one. So the rule is to give every deduplication a total order. A tie decided by row order is a bug waiting for a rerun. Next we put quality rules around all this.",
}
