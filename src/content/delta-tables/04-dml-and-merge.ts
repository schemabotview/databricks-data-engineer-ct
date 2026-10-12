import type { Section } from '../types'

export const dmlAndMerge: Section = {
  id: 'dml-and-merge',
  title: 'INSERT, UPDATE, DELETE, and MERGE with explicit match semantics',
  scene: 'dml-semantics',
  focus: 'merge-code',
  slide: `## MERGE: say what matches

**Objective:** read a \`MERGE\` and predict which rows change.

**Model:** \`INSERT\`, \`UPDATE\` and \`DELETE\` each commit a new version. \`MERGE\` joins a **source** to the **target** on an \`ON\` condition, then applies one action per row: matched or not matched.

### Worked: the MERGE at version 5 (local run)
- \`updates\` holds o8 (now COMPLETED) and o9 (new, store 9, 45.00)
- o8 **matches**, so its status changes from PENDING to COMPLETED
- o9 **does not match**, so it is inserted
- History: 1 row updated, 1 row inserted

### The rule that bites
- If two source rows match one target row, MERGE **raises an error**
- It never silently picks one
- So make the source unique on the key first, for example the latest row per key`,
  narration:
    "Four statements change rows in a Delta table: insert, update, delete and merge. Each one commits a new version. Merge is the most powerful, and the most often misread, so let's be precise about it. A merge joins a source to the target table on a condition. For each row it asks whether there is a match, and then applies the action you wrote for that case. In our example, the source is a small table of updates holding two orders. Order eight is already in the table as pending, and the update marks it completed. Order nine is not in the table at all. The on condition compares order ids. Order eight matches, so the matched clause runs and its status changes from pending to completed. Order nine does not match, so the not matched clause runs and it is inserted. The table history for that commit confirms it: one row updated and one row inserted. Now the rule that catches people. If two source rows both match the same target row, merge raises an error. In the local run it reported that multiple source rows matched one target row. It never silently picks one, which is a good thing, because picking one would make the result depend on row order. So before you merge, make your source unique on the match key. So make the source unique on the key first, for example by keeping the latest row per key. That is why deduplication comes before merge in later chapters. Next we look at the history those commits leave behind.",
}
