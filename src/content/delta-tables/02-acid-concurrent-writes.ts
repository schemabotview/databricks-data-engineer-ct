import type { Section } from '../types'

export const acidConcurrentWrites: Section = {
  id: 'acid-concurrent-writes',
  title: 'ACID, concurrent writes, and the scope of transaction guarantees',
  scene: 'write-conflict',
  focus: 'conflict-error',
  slide: `## Atomic per table, not magic

**Objective:** say what a Delta commit guarantees and what it leaves to you.

**Model:** a commit is **atomic**: the new log file either appears, whole, or it does not. Readers see a complete version. Writers use **optimistic concurrency**: each assumes no conflict and checks at commit time.

### Worked: two writers on o1 (local run)
- Writer A reads version 1, then scans slowly
- Writer B updates o1's amount and commits **version 2**
- A's commit is refused: \`ConcurrentAppendException\`. **o1 is 41.00, COMPLETED**
- Two plain \`INSERT\`s at once both committed

### Why this design
- Nobody takes a lock, so readers and unrelated writers are never blocked

### Scope and misconception
- The guarantee covers **one table** per commit
- **"A refused write retried itself."** It did not; the application must retry`,
  narration:
    "Delta advertises ACID transactions, and the useful question is what that actually covers. Start with atomicity. A commit works by adding one new log file. Either that file appears whole, or it does not appear, so a reader sees a complete version of the table and never half a write. Next, concurrency. Delta uses optimistic concurrency: each writer assumes nobody else is conflicting, does its work against the snapshot it read, and then checks at commit time. Let's force a real conflict in a local run. Writer A starts an update on order one, reads version one, and scans slowly. Meanwhile writer B updates the amount on order one, and commits version two. When A finally tries to commit, Delta refuses, with a concurrent append exception telling it the table changed and to try again. After that, order one has amount forty one and status completed. A's change to the status was not applied. Contrast that with two plain inserts at the same moment. Both committed, because adding unrelated rows does not conflict. This design means nobody takes a lock, so readers and unrelated writers are never blocked. Now the limits. The guarantee covers one table per commit. And a refused writer does not retry on its own. Your application, or the job that runs it, must decide to retry, and it must be safe to run twice. Error codes and wording can differ on Databricks. Next we look at what Delta does when the data itself does not match the table.",
}
