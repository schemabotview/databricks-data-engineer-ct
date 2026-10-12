import type { Section } from '../types'

export const backfillsReplayBronzeWalkthrough: Section = {
  id: 'backfills-replay-bronze-walkthrough',
  title: 'Backfills, replay, duplicate source events, and the first bronze-table walkthrough',
  scene: 'bronze-walkthrough',
  focus: 'bronze-counts',
  slide: `## Count it in, count it out

**Objective:** follow the order files into a bronze table and predict what a replay does.

**Model:** **bronze** keeps what arrived, as sent, with lineage back to the file. A **backfill** loads history; a **replay** re-reads input already seen. Both can duplicate rows.

### Worked: source to bronze (local run)
- Files a, b, c hold **3 + 3 + 2** rows, so bronze holds **8**
- Those 8 rows carry **7** distinct \`order_id\` values, because o4 was resent
- Replaying every file into the same table gives **16**, with no dedupe
- Each row records its \`source_file\`, so any row traces to its file

### Habits
- Make loads repeat-safe: key them, or deduplicate afterwards
- Record the source file on every row
- Count in and count out at every hop`,
  narration:
    "Now let's put the chapter together in the first bronze table. Bronze keeps what arrived, as it was sent, with a trail back to where it came from. In our example, the three files hold three, three and two rows, so bronze holds eight rows. Those eight rows carry seven distinct order ids, because order four was resent in the third file. Each row also records its source file, taken from the file metadata, so any row can be traced to the file that brought it. The board also shows an ingested at timestamp. That is a design choice I recommend, and it was not part of my run. Two operations can change those counts. A backfill loads history that the pipeline has not seen. A replay re-reads input it already read, for example after a lost checkpoint. Both can duplicate rows. In the local run, replaying every file into the same table gave sixteen rows, eight of them copies, and nothing in a plain append stopped it. So the guard has to be designed. You can key the load, or deduplicate afterwards, and we do both in later chapters. So make loads repeat safe, record the source file on every row, and count in and out at every hop. For now, the useful habit is counting in and counting out. Three files, eight rows, seven distinct orders. Raw arrival is accounted for. Next we turn it into correct and useful business records.",
}
