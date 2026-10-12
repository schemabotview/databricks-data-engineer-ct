import type { Section } from '../types'

export const incrementalRecomputeSemantics: Section = {
  id: 'incremental-recompute-semantics',
  title: 'Incremental processing, recomputation, and source-change semantics',
  scene: 'incremental-semantics',
  focus: 'update-table',
  slide: `## Not every dataset refreshes the same way

**Objective:** say what each dataset kind reads on an update, and what breaks it.

**Model:** a streaming table reads **only new input**. A materialized view is refreshed **incrementally when the platform can**, and otherwise recomputed. Neither is promised for every query.

### Worked: four updates (stream: local analogue)
- New rows per update: **3, 3, 0, 2**. The stream reads exactly those
- Update 3 had nothing new, so a streaming table did no work
- Materialized view: documented as incremental **or** full: check, don't assume

### When the source changes
- Updating a source row broke a local Delta stream: \`DELTA_SOURCE_TABLE_IGNORE_CHANGES\`
- \`skipChangeCommits\` lets it continue but the **update never arrives**`,
  narration:
    "People assume that every dataset in a pipeline refreshes the same way, and it does not. A streaming table reads only new input. A materialized view is documented to refresh incrementally when the platform can, and otherwise to recompute, and which one it uses depends on the query, so you should not assume it. Here are four updates, with new rows of three, three, zero and two. For the streaming read, I use the local analogue from chapter four, where a file stream read exactly three, three, zero and two rows. The third update had nothing new, so the streaming table did no work. For the materialized view, I can only report what is documented, which is incremental or full, so check how your query refreshes before you depend on it. Now the important case, where the source itself changes. I tested this locally. I streamed from a Delta table, then updated a row in that table. The stream failed with an error called source table ignore changes, saying a data update was detected, which is not supported. If you set the option skip change commits, the stream carries on, but the update never arrives downstream. That is why a streaming table assumes its source is append only. If your source updates rows, you need a different design, which is exactly what the next section is for. Next we look at AUTO CDC.",
}
