import type { Section } from '../types'

export const autoCdcScd: Section = {
  id: 'auto-cdc-scd',
  title: 'AUTO CDC and SCD definitions with explicit keys and sequencing',
  scene: 'auto-cdc-sequence',
  focus: 'autocdc-code',
  slide: `## The sequence-guarded merge, declared

**Objective:** read an \`AUTO CDC\` definition and say which part replaces which hand-written rule.

**Model:** \`AUTO CDC INTO\` applies a change feed to a target streaming table. **\`KEYS\`** names the row, **\`SEQUENCE BY\`** orders changes, and **\`STORED AS SCD TYPE 1 | 2\`** picks latest-only or history. (Documented, not run.)

### Mapping from Chapter 6
- \`s.seq > t.seq\` in the MERGE becomes \`SEQUENCE BY\`
- A \`STRUCT\` of columns breaks ties, like our tie-breaker
- Type 2 adds \`__START_AT\` and \`__END_AT\`
- Our hand-built history for o6 is shown as **illustration**, not output

### What stays yours
- Choosing the key and the sequence column
- Deciding whether a delete should close history

### Older names
- \`APPLY CHANGES INTO\` and \`apply_changes\` are the older spellings`,
  narration:
    "Chapter six built a sequence guarded merge by hand: keep a record only if its sequence is newer, keep deletes as markers, and break ties with a second sort key. AUTO CDC lets you declare that instead. It applies a change feed to a target streaming table. You name the keys, which says what identifies a row. You say what to sequence by, which says which change is newer, and you choose whether to store the latest only, which is type one, or the full history, which is type two. Compare the definition with what we wrote by hand. The condition where the new sequence is greater than the stored one becomes the sequence by clause. Using a struct of several columns is documented for breaking ties, which matches our tie breaker. I would re-verify that clause. With type two, the target gets start at and end at columns, whose type matches the sequence column. I could not run any of this, so the small table is an illustration I built from the earlier events for order six. It is shaped like the documented output, and it was not produced by AUTO CDC. Choosing the key and the sequence column, and deciding whether a delete should close history, are still your decisions. You may also see this feature under older names, apply changes into in SQL and apply changes in Python. Those are the same idea under its previous spelling. The point is that the correctness rules from chapter six, ordering, ties, deletes and history, are now declared and managed. Next we see how updates and refreshes behave.",
}
