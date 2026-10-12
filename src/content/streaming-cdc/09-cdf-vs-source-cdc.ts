import type { Section } from '../types'

export const cdfVsSourceCdc: Section = {
  id: 'cdf-vs-source-cdc',
  title: 'Table CDF versus source CDC: snapshots, versions, and replay windows',
  scene: 'cdf-vs-cdc',
  focus: 'feed-compare',
  slide: `## Two feeds, two different questions

**Objective:** say what a table's change feed can and cannot replace in a CDC design.

**Model:** **source CDC** records what the source did, in its order. A Delta table's **change feed** records what the table changed, per commit. This example uses a **configured** feed.

### Worked: the sequence-guarded apply (local run)
- The source sent **8** records; the table's feed recorded **9** rows
- Batch 1: 3 inserts. Batch 2: 3 updates, each a **before and an after** row
- Batch 3's two late records were ignored, so they left **no row**

### Boundaries
- The feed shows table changes, not the source's intent or sequence
- Neither feed is a permanent archive; automatic feeds on eligible tables were **not tested**`,
  narration:
    "People often treat the change feed of a Delta table as if it were the same thing as change data capture from the source. They answer different questions. Source CDC says what the source did, in the source's order. The table's change feed says what this table changed, one commit at a time. Here is a local example, using a feed that is configured with a table property. I applied the three batches of source records to a table with a sequence guard, and then read the table's change feed. The source had sent eight records. The feed contains nine rows. Batch one produced three inserts. Batch two produced six rows, because each of its three updates appears as a before image and an after image, even the delete, which I stored as a marker update. Batch three's two late records were ignored by the guard, so they changed nothing and left no row in the feed at all. So you cannot rebuild the source's record of events from the table's feed, because intent and order are not there. And neither feed is a permanent archive. Both are subject to retention, which the next section demonstrates. One more thing I want to be clear about. This example uses a configured feed. Databricks documents tables that can provide a feed automatically, but I did not test that, so I make no claim about it. Next we put the whole recovery story together.",
}
