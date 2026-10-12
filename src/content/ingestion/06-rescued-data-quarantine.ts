import type { Section } from '../types'

export const rescuedDataQuarantine: Section = {
  id: 'rescued-data-quarantine',
  title: 'Rescued data, quarantine, malformed records, and reconciliation',
  scene: 'rescued-quarantine',
  focus: 'bad-row-table',
  slide: `## Never drop a record without a trace

**Objective:** keep what cannot be parsed, and prove every row is accounted for.

**Model:** read **permissively** and keep the raw text of any record that fails. Rows that parse go on; rows that do not are **quarantined** with their original line.

### Worked: the three order files (local run)
- Read with a typed schema: **8** rows read
- o7's amount \`n/a\` cannot be a decimal, so it is **flagged**, keeping \`o7,9,n/a,COMPLETED\`
- **8 = 7 parsed + 1 flagged.** The 7 still contain the resent o4

### What quarantine needs
- The raw line, the file it came from, and when it arrived
- An owner who decides: fix, replay or discard

### Platform note
- Databricks' \`_rescued_data\` column (documented, not run) collects unexpected or mismatched fields; it is not this option`,
  narration:
    "A pipeline that silently drops a record it cannot read has lost data, and nobody knows. The safer habit is to keep what you could not parse, with its original text, and to prove that every row is accounted for. In a local run, I read the three order files with a typed schema in permissive mode, and asked Spark to keep the raw text of any record that failed in a column called bad record. Eight rows were read. Order seven has the amount n slash a, which cannot be a decimal, so its amount became null and its original line, o seven, nine, n slash a, completed, was kept in the bad record column. Everything else parsed. Now reconcile. Eight rows read equals seven parsed plus one flagged. And notice that the seven good rows still include the resent order four, because removing duplicates is a different job, which comes in the next chapter. A flagged row goes to quarantine, a place where someone can look at it and decide what to do. It needs the raw line, the file it came from and when it arrived, and it needs an owner who decides whether to fix it, replay it or discard it. Databricks has a related feature, a column named rescued data, which collects fields that were unexpected or did not match. I did not run it, and it works differently from this option, so read its documentation before relying on it. Next we look at managed connectors.",
}
