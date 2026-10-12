import type { Section } from '../types'

export const sourceCdcSequenceDeletes: Section = {
  id: 'source-cdc-sequence-deletes',
  title: 'Source CDC: keys, operation types, sequence ordering, and deletes',
  scene: 'cdc-feed',
  focus: 'apply-compare',
  slide: `## Order by sequence, not by arrival

**Objective:** apply a change feed so that late and repeated records cannot undo newer ones.

**Model:** **change data capture** sends a record per source change: a **key**, an **operation** (insert, update, delete) and a **sequence** from the source. Arrival order is not the source's order.

### Worked: eight records, three batches (local run)
- Batch 3 holds a **late update** (o1, seq 2) and a **repeat insert** (o3)
- Applied in arrival order: o1 goes back to **PENDING**; deleted o3 **returns**
- Applied by sequence, with a delete marker: o1 **COMPLETED**, o3 **deleted**

### Why a delete marker
- A hard delete forgets the key, so a late insert recreates it
- A marker with its \`seq\` remembers it; a newer \`seq\` must win
- A repeat or late record with an old \`seq\` changes nothing`,
  narration:
    "Change data capture means the source sends you a record for each change it made: a key, an operation, which is insert, update or delete, and a sequence number from the source that says what order the changes happened in. The critical point is that the order the records arrive in is not the source's order. Here is a feed of eight records in three batches, from a local run. In batch one, three orders are inserted. In batch two, order one is updated to completed with sequence three, order two is updated, and order three is deleted. Batch three brings two late records: an older update for order one, with sequence two, and a repeat of order three's original insert. Now apply them in arrival order, with hard deletes and no sequence check. Order one ends up back at pending, because the older update arrived last and overwrote the newer one. And order three, which was deleted, comes back, because the late insert found no row and created one. Both are wrong, and neither raised an error. Applied by sequence, a record only changes a row if its sequence is greater than the one already stored. Deletes are kept as a marker rather than removed, so a late insert cannot bring the row back. A marker works because a hard delete forgets the key, while a marker with its sequence remembers it. Then order one is completed, and order three stays deleted. Next we keep not just the latest state but the history.",
}
