import type { Section } from '../types'

export const batchLoadsCopyInto: Section = {
  id: 'batch-loads-copy-into',
  title: 'Batch loads and COPY INTO: scope and repeat-load assumptions',
  scene: 'batch-load',
  focus: 'repeat-table',
  slide: `## A load is only as repeatable as you make it

**Objective:** say what a batch load covers and what happens if it runs twice.

**Model:** a **batch load** reads a named set of files once. \`COPY INTO\` is Databricks SQL for that, and is documented to skip files it has already loaded. A plain append has no such memory.

### Worked: the same eight rows, loaded twice (local run)
- First load: bronze has **8** rows
- The same plain append again: bronze has **16**
- \`COPY INTO\` (documented, not run) would skip the files it already loaded

### Misconception and scope
- **"Re-running a load is safe."** Only if the load tracks what it read
- \`COPY INTO\` covers the files in the path you name, so changed or new files outside it are not seen`,
  narration:
    "The simplest way to ingest is a batch load: read a named set of files, once, and write them into a table. On Databricks, the SQL command for this is copy into. Its documented behaviour is that it remembers which files it has already loaded, and skips them if you run it again. I could not run it here, so treat that as documented, not run. What I could run is the plain alternative. Reading the same eight rows from the three files and appending them to a table gives eight rows. Running the same append a second time gives sixteen, because a plain append has no memory of what it read. So the first assumption to check in any load is what happens when it runs twice. Jobs get retried, people click run again, and a load that is not repeat safe quietly doubles your data. The second assumption is scope. Copy into loads the files in the path you name. Files that are changed or added outside that path are simply not seen. The misconception to avoid is that re-running a load is safe. It is safe only if the load tracks what it has already read. Next we look at the source that does this tracking for you incrementally.",
}
