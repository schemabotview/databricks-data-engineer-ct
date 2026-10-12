import type { Section } from '../types'

export const updatesRefreshReplay: Section = {
  id: 'updates-refresh-replay',
  title: 'Updates, refresh scope, full refresh, and replay consequences',
  scene: 'refresh-modes',
  focus: 'full-refresh-math',
  slide: `## A full refresh trusts the source

**Objective:** choose a refresh scope, and say what a full refresh can lose.

**Model:** an **update** processes new data. You can refresh **selected tables**. A **full refresh** clears a table and rebuilds it by re-reading its sources. (Documented, not run.)

### Worked: the order files
- Files a, b, c hold **3, 3, 2** rows, so a full refresh rebuilds **8**
- If file c has **expired** at the source, it rebuilds only **6**
- That is arithmetic from the Chapter 4 counts, not a pipeline run

### Lost checkpoint vs full refresh
- Chapter 4's lost checkpoint **doubled** the rows: 16
- A full refresh also clears the table, so it rebuilds, not doubles

### Guard
- \`pipelines.reset.allowed = false\` blocks a full refresh of a table`,
  narration:
    "A pipeline can run in a few ways, and the difference between them is a matter of what gets reprocessed. A normal update processes new data. You can also refresh only selected tables, which saves time but can leave dependents stale. And a full refresh clears a table and rebuilds it by reading its sources again. All of this is documented, not run here. The danger of a full refresh is that it trusts the source. Take our order files. Files a, b and c hold three, three and two rows, so a full refresh rebuilds eight rows. But suppose file c has expired at the source, because the source only keeps files for a limited time. Then a full refresh can rebuild only six rows, and the two rows that came from file c are gone for good. That figure is simple arithmetic from the counts we measured in chapter four, not the result of a pipeline run. In chapter four we also saw what a lost checkpoint does without any truncation: the same files were appended again and the table doubled. A full refresh avoids the doubling because it also clears the table, but it still depends on what the source still has. To fix logic in one table, refresh that table and then its dependents. There is a documented guard. A table property called pipelines reset allowed, set to false, blocks a full refresh of that table. And the habit is to know the source's retention before you ever press the button. Next we look at the evidence a pipeline leaves.",
}
