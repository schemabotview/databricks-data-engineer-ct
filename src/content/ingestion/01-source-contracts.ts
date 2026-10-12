import type { Section } from '../types'

export const sourceContracts: Section = {
  id: 'source-contracts',
  title: 'Source contracts: formats, keys, arrival patterns, and source retention',
  scene: 'source-contract',
  focus: 'contract-table',
  slide: `## Write the source down first

**Objective:** list what an ingestion design may assume about a source, and what it may not.

**Model:** a **source contract** names the format, the key, how data arrives, whether records repeat, and how long the source keeps them. Everything the pipeline does later leans on these.

### Worked: the retail order files
- **CSV with a header**, keyed by \`order_id\`
- Files arrive **one at a time**: three files, 3, 3 and 2 rows
- **o4 appears twice**, so a repeat is possible
- Retention is **assumed** 30 days here. That sets how far back a replay can go.

### Also write down
- Who owns the source and how changes are announced
- Whether old files can be corrected or replaced

### Misconception
- **"The source is the source of truth."** Only for what it still holds, and what it promised`,
  narration:
    "Before writing any ingestion code, write down what the source promises. Call it a source contract. It names the format, the key, how data arrives, whether records can repeat, and how long the source keeps them. Everything the pipeline does later leans on those answers. Take our retail order files. They are CSV files with a header row, and the key is the order id. They arrive one at a time. In this example there are three files, with three, three and two rows. Notice that order four appears twice, in the second and third files, so a repeat is possible, and the design has to have a rule for it. Finally, retention. I assumed the source keeps files for thirty days. That is an assumption for the example, not a measurement, and it matters because it sets how far back you could ever replay. The questions on the board are the ones to ask a source owner. Can a key repeat, and across files? Can old files change or disappear? How long can I replay? And who will tell me when the format changes? Also record who owns the source and how changes are announced, and whether old files can be corrected or replaced after the fact. A misconception worth naming is that the source is the source of truth. It is the source of truth only for what it still holds, and only to the extent it keeps its promises. Next we load these files in bulk.",
}
