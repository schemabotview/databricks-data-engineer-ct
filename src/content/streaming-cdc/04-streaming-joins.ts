import type { Section } from '../types'

export const streamingJoins: Section = {
  id: 'streaming-joins',
  title: 'Streaming joins and bounded-state assumptions',
  scene: 'stream-joins',
  focus: 'join-output',
  slide: `## Joins need a time bound

**Objective:** say what a stream-stream join must remember, and what makes that bounded.

**Model:** a **stream-static** join reads the reference table fresh and keeps no stream state. A **stream-stream** join buffers both sides until a match can no longer arrive, which needs a **watermark** and a **time condition**.

### Worked: orders and payments (local run)
- Condition: payment within **15 minutes** of the order
- The resent **o4 matches twice**: the duplicate order doubled the pair
- **o10's** payment came 24 minutes later: **no match**
- A left outer join emits o10 with NULL **only at batch 4**, after the watermark passed

### Why outer joins wait
- A match could still arrive until the watermark passes
- So unmatched rows appear late, by design

### Stream-static
- Store names joined fresh: Hull **2**, Leeds **5**, York **3**`,
  narration:
    "Joining a stream to something else raises a new question: what must be remembered? The easy case is a stream joined to a static table, such as the store reference data. Spark reads the reference table when it needs it, and keeps no state for the stream. In our run, joining the order events to store names gave Hull two, Leeds five, and York three. A join of two streams is harder. An order and its payment may arrive in different batches, so Spark has to buffer each side until a match can no longer arrive. To keep that buffer bounded you need two things: a watermark on each side, and a time condition in the join, here that the payment comes within fifteen minutes of the order. In the local run, the inner join found orders one and two in batch zero. In batch one it found order four twice, because the order was resent and each copy matched the payment, and also order five. Order ten never matched, because its payment came twenty four minutes after the order, outside the bound. A left outer join is where you see the cost of bounded state. Order ten was emitted with a null payment only in the last batch, after the watermark had passed, because until then a match was still possible. An outer result is delayed because a match could still arrive until the watermark passes. So duplicates upstream multiply here, and outer results are delayed by design. Next we look at restarting a query.",
}
