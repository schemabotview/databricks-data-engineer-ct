import type { Section } from '../types'

export const filesLogsSnapshots: Section = {
  id: 'files-logs-snapshots',
  title: 'Data files, transaction logs, snapshots, and table metadata',
  scene: 'delta-versions',
  focus: 'log-actions',
  slide: `## A table is a log plus immutable files

**Objective:** explain how a Delta table's current contents follow from its log.

**Model:** each commit appends a JSON file to \`_delta_log\` with **actions**: \`add\` a data file, \`remove\` one, \`metaData\` for schema. A **snapshot** is the set of files you get by replaying the log up to one version. Data files are never edited.

### Worked: the \`orders\` table, versions 0 to 5 (local run)
- v1 wrote six rows, v2 added o8, so v2 holds 7 rows
- \`UPDATE\` o6 and \`DELETE\` o3 each wrote a \`remove\` and an \`add\`: the file was **rewritten**, not edited
- The six commits ended at 7 rows (after the MERGE)

### Misconception
- **"UPDATE changes the file in place."** The old file stays until VACUUM

### Why it matters
- Kept old files are what make history and time travel possible
- They are also why storage grows until VACUUM`,
  narration:
    "Chapter one showed that a Delta table is data files plus a transaction log. Now let's see precisely how the log defines the table. Every change to the table is a commit, and each commit appends one JSON file to the delta log folder, numbered in order. Inside that file are actions. An add action says a data file is now part of the table. A remove action says a data file no longer is. The metadata action carries the schema. To know what the table contains at some version, you replay the log up to that version and see which files are left. That set of files is a snapshot. Data files themselves are never edited. Here is our silver orders table in a local run of Spark four and Delta four. Version zero is the create, with only metadata and protocol actions. Version one writes the six orders, version two adds order eight, so the table now has seven rows. Version three updates order six, and version four deletes order three. Both of those commits contain a remove and an add. That tells you what really happened: the file holding those rows was rewritten as a new file, and the old one was marked removed. The sixth commit, version five, is a merge, and it leaves seven rows. A misconception is that an update changes the file in place. It does not. The old file stays on disk, still reachable through older versions, until something vacuums it, which is section six. That is the trade: kept old files make history and time travel possible, and they are also why storage grows until a vacuum. Next we ask what happens when two writers commit at once.",
}
