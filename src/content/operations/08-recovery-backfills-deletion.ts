import type { Section } from '../types'

export const recoveryBackfillsDeletion: Section = {
  id: 'recovery-backfills-deletion',
  title: 'Recovery, backfills, checkpoints, retention, and deletion obligations',
  scene: 'deletion-recovery',
  focus: 'remains-table',
  slide: `## Deleting is not one command

**Objective:** list every place deleted data survives, and what removes it.

**Model:** a \`DELETE\` removes rows from the **current** table only. Older **versions**, the **change feed** and **derived tables** keep the data until \`VACUUM\` and a **recompute** remove it.

### Worked: delete customer c1's rows (local run)
- Current table: c1 **gone**. Older version and change feed: c1 **still readable**
- A derived total still read **100.00**, counting c1
- After \`VACUUM\`: version and feed **unreadable**; the derived total still **100.00**
- Recomputed, the total is **35.00**

### Backfills and checkpoints
- A backfill re-reads history: it needs **idempotent** writes
- Checkpoints hold offsets and state: protect them
- Source retention limits any replay

### Obligation
- Retention and VACUUM timing set **when** data is really gone`,
  narration:
    "Recovery has a mirror image, which is deleting data on purpose, and the lesson is that deleting is not one command. I demonstrated this in a local run. I made a small table of orders with the change feed on, and a derived table holding the total spend, computed before the delete. Then I deleted customer c1's rows. The current table no longer has them. But look at where the data still lives. An older version of the table still returned c1's rows when I read it. The change feed still returned c1's rows, with their values, as delete records. And the derived table still said one hundred dollars, which counts c1. Then I vacuumed with a retention of zero hours, which I can only do on a throwaway table. Reading the old version and the change feed now failed, because the files were gone. But the derived table was untouched, still one hundred, because vacuum only cleans the files of the table it runs on. Only recomputing it brought the total down to thirty five. Recovery has the same shape. A backfill re reads history, so it needs idempotent writes. Checkpoints hold offsets and state, so protect them. And source retention limits any replay. So a deletion obligation is a checklist. Delete at the source of truth, vacuum once your retention allows, recompute every derived table, and check change feeds, checkpoints and any copies. And remember that the retention period decides when the data is truly gone. Next we look at secrets and identities.",
}
