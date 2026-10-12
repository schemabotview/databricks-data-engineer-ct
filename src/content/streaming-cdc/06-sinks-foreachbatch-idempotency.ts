import type { Section } from '../types'

export const sinksForeachbatchIdempotency: Section = {
  id: 'sinks-foreachbatch-idempotency',
  title: 'Sink effects, foreachBatch, idempotency, and delivery guarantees',
  scene: 'replay-sinks',
  focus: 'sink-table',
  slide: `## A replayed batch must be harmless

**Objective:** explain why a restart can write the same rows twice, and how to make that safe.

**Model:** Spark commits a batch **after** your \`foreachBatch\` function returns. A crash in between **replays** the batch, so the function can run twice for the same data: **at-least-once**. An **idempotent** write makes that safe.

### Worked: a crash after batch 2 was written (local run)
- 10 source rows, 9 distinct
- After the crash: append sink **8** rows, MERGE sink **7**
- After the restart replayed batch 2: append sink **12**, MERGE sink **9**
- The append sink holds **2 replayed copies**

### Guarantees need a pair
- Say which **source** and which **sink**, never "exactly once" alone`,
  narration:
    "Even with a checkpoint, a restart can write the same rows twice, and the reason is the order of events. When you use for each batch, Spark runs your function for a batch, and only after it returns does Spark record the batch as committed. If the process dies between those two moments, then on restart Spark replays the batch, and your function runs again on the same data. So the guarantee to your sink is at least once. To see this, I made the function crash on purpose after it wrote batch two, in a local run. There were ten source rows, nine of them distinct, because the source itself resent order four. I wrote every batch to two sinks. One was a plain append, and the other was a merge keyed on order id and event time. After the crash, the append sink held eight rows and the merge sink seven. After the restart, which replayed batch two, the append sink held twelve rows, including two replayed copies, while the merge sink held nine, the correct number. A merge keyed on the data is idempotent, which means doing it twice has the same effect as doing it once. That is the fix. When someone says a pipeline is exactly once, ask which source and which sink they mean, because the guarantee comes from the pair, and from your function being idempotent. Next we look at changes coming from a source system.",
}
