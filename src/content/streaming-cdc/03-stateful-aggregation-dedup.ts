import type { Section } from '../types'

export const statefulAggregationDedup: Section = {
  id: 'stateful-aggregation-dedup',
  title: 'Stateful aggregation and deduplication: state size and expiry',
  scene: 'state-growth',
  focus: 'state-table',
  slide: `## State grows until something expires it

**Objective:** predict whether a stateful query's memory use is bounded.

**Model:** a streaming aggregation or deduplication keeps **state**: one row per open window or per key seen. A **watermark** lets Spark drop state that can no longer change.

### Worked: the same four files (local run)
- Windowed sum without a watermark: state **2, 3, 4, 5** rows, only growing
- With a watermark: **2, 3, 3, 3, 2**, as windows close
- Deduplicating on \`order_id\` and time, no watermark: **3, 5, 7, 9**
- With a watermark: **3, 3, 4, 3, 1**

### Trade-off
- Expiry bounds state, and costs you **late data** (o12 dropped)
- A dedup key without time never expires`,
  narration:
    "A stateful streaming query has to remember things. A windowed sum keeps a row for every window that is still open. A deduplication keeps a row for every key it has seen, so it can recognise a repeat. The question to ask of any stateful query is whether that memory is bounded. In a local run on the same four files, I measured the number of state rows after each batch. A windowed sum with no watermark held two, then three, four and five rows. It only grew, because no window is ever known to be finished. With a ten minute watermark the counts were two, three, three, three and two, because windows closed and left the state. Deduplication tells the same story. Dropping duplicates on order id and event time with no watermark kept three, five, seven, then nine rows, one per distinct key, forever. With a watermark it went three, three, four, three, one, because keys older than the watermark expired. That expiry is not free. It is also what dropped order twelve as late. So the trade is plain. A watermark bounds your state and costs you late data. And a deduplication key with no time component can never expire, so on an unbounded stream its state grows without limit. Choose the delay by how late your data really arrives. Next we join two streams.",
}
