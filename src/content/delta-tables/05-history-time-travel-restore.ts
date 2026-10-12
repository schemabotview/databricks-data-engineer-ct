import type { Section } from '../types'

export const historyTimeTravelRestore: Section = {
  id: 'history-time-travel-restore',
  title: 'History, time travel, restore, and their distinctions',
  scene: 'history-restore',
  focus: 'distinctions',
  slide: `## Read the past, or rewind to it

**Objective:** tell apart reading an old version from restoring one.

**Model:** the log keeps a history of commits. \`VERSION AS OF n\` **reads** version n without changing anything. \`RESTORE\` **writes** a new commit that makes the table match version n.

### Worked: undoing the MERGE (local run)
- Version 5 (the MERGE) left **7** rows. We decide it was wrong
- \`RESTORE TABLE orders TO VERSION AS OF 4\` creates **version 6**, **6** rows
- History still lists 5 and 6, and \`VERSION AS OF 5\` still reads 7 rows

### Misconception
- **"Restore erases history."** It adds to it
- Both rely on the old files still existing, which is the next section

### When to use which
- Inspect or compare a past state: time travel
- Undo a bad change: restore`,
  narration:
    "Because every commit stays in the log, a Delta table remembers its past, and there are three related things you can do with that. You can list the history, which shows each version and its operation. You can time travel, which means reading the table as of an older version, with version as of and a number. And you can restore, which means making the table match an older version again. The difference between the last two is the one worth remembering. Time travel only reads. Nothing changes. Restore writes: it adds a brand new commit that brings the table back to the earlier state. In our local run, the merge at version five left seven rows, and suppose we decide it was wrong. We restore the table to version four. That creates version six, and the table has six rows again. Notice what did not happen. Version five is still in the history, and reading version five still returns seven rows. So the misconception to avoid is that restore erases history. It adds to it, and the table is back, but the record of what happened stays. So use time travel to inspect or compare a past state, and restore to undo a bad change. There is a catch, though, and it is the subject of the next section. Both time travel and restore depend on the old data files still being there. If those files have been removed, the past is no longer readable. Next we look at retention and vacuum.",
}
