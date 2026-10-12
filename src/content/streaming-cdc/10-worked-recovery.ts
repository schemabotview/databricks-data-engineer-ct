import type { Section } from '../types'

export const workedRecovery: Section = {
  id: 'worked-recovery',
  title: 'Worked recovery: duplicates, out-of-order changes, and unavailable history',
  scene: 'recovery-guards',
  focus: 'recovery-table',
  slide: `## A restart you can trust

**Objective:** state which guard protects against each failure, and where history runs out.

**Model:** the **sequence-guarded merge** only applies a record whose \`seq\` is newer, and keeps deletes as markers. That makes the apply **idempotent** and **order-independent**.

### Worked: three batches, tested (local run)
- Applied **twice**: the same table
- Applied in **reverse order**: the same table
- A late insert after a delete: o3 **stays deleted**
- Old change feed after \`VACUUM RETAIN 0 HOURS\`: **unreadable**

### Know before you need it
- Retention of the source, the stream and the tables
- Whether a snapshot reload is practical

### When history is gone
- A guard cannot recover rows nobody kept: reload from a **snapshot**
- Retention decides how far back you can replay`,
  narration:
    "Let's finish the chapter with a recovery you could trust. The core of it is one statement: a merge that applies a source record only when its sequence is greater than the one already stored, and that keeps deletes as markers. That one rule makes the apply idempotent and independent of arrival order, and I tested both in a local run. Applying all three batches twice left exactly the same table. Applying them in reverse order left exactly the same table. A late insert for order three, which had already been deleted, did not bring it back, because the delete marker has a higher sequence. Those are the failures the guard handles. There is one it cannot. I vacuumed the table with a retention of zero hours, and then tried to read its change feed from version one. The read failed, because the files were gone. A guard cannot recover rows that nobody kept. If the history you need is beyond your retention, whether that is the table's, the source's or a stream's, the recovery is to reload from a snapshot of the source, and then resume. Know the retention of the source, the stream and the tables, and whether a snapshot reload is practical, before you need it. So retention decides how far back you can replay, and you should know that number before you need it. The change processing rules are now explicit. Next we express them through managed declarative pipeline abstractions.",
}
