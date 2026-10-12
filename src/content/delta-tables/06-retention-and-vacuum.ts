import type { Section } from '../types'

export const retentionAndVacuum: Section = {
  id: 'retention-and-vacuum',
  title: 'Retention and VACUUM: recoverability, readers, and storage trade-offs',
  scene: 'retention-timeline',
  focus: 'readability-table',
  slide: `## Old versions have a shelf life

**Objective:** explain why a former version can stop being readable, and what that costs.

**Model:** \`VACUUM\` deletes data files that no current version needs and that are older than the **retention** period. That frees storage, and it removes the files old versions read.

### Worked: a throwaway table (local run)
- After \`VACUUM ... RETAIN 0 HOURS\`, versions **1** and **2** fail with \`FILE_NOT_EXIST\`
- Version **3** and the current table still read, because their files remain
- The default check **refused** 0 hours until switched off. Defaults are 7 days (files) and 30 days (log), documented

### Trade-off
- Longer retention: more recovery, more storage
- A reader older than the retention can fail

### Choose on purpose
- Match retention to the longest reader or recovery window you promise`,
  narration:
    "Time travel and restore are not free, and they are not permanent. When a file is replaced by an update or a delete, the old file stays on disk so that older versions can still be read. That costs storage. The command that reclaims it is vacuum. Vacuum deletes data files that no current version needs and that are older than the retention period. Once those files are gone, the versions that used them can no longer be read. Here is a throwaway table in a local run. It has three versions: two ids, then a third added, then the first deleted. Before vacuum, all three versions read fine. Then I ran vacuum with a retention of zero hours. To do that I had to switch off a safety check, because by default Delta refuses a retention shorter than seven days. After the vacuum, versions one and two fail with a file not exist error. Version three and the current table still read, because the files they need are still there. The documented defaults are seven days for removed files and thirty days for the commit log, and I would verify them on your platform. The trade-off is plain. Longer retention gives you more ability to recover and more storage cost. And a reader or a stream that needs data older than the retention can fail. So retention should be chosen on purpose, to match the longest reader or recovery window you promise. Next we look at recording changes themselves.",
}
