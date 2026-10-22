import type { Section } from '../types'

export const readingExecutionEvidence: Section = {
  id: 'reading-execution-evidence',
  title: 'Reading execution evidence',
  scene: 'fast-evidence',
  narration:
    "Before changing anything, look at what the engine actually did. Spark records it in the Spark UI, and the same numbers are available from the UI's REST API, which is what the tool reads. The first half moves eighty percent of the orders onto one store, store seven, and shuffles them into four partitions by store. Then it asks the API for that stage's task summary: the rows each task read, at the minimum, the quartiles and the maximum. The terminal shows it. The smallest task read thirty-six thousand rows, the median sixty-four thousand, and the largest eight hundred and fifty-five thousand, thirteen times the median. That shape is skew: one task does almost all the work while the others wait. The second half aggregates just one thousand rows three ways and reads how many tasks the aggregation used. With the default two hundred shuffle partitions, two hundred tasks, for a thousand rows, which is overhead, not work. With four partitions, four tasks. And with two hundred partitions but adaptive query execution on, one task: adaptive execution looked at the real sizes after the shuffle and merged the tiny partitions. The table on the right keeps the skewed quantiles. The list says how to use evidence like this. A maximum far above the median is skew. Hundreds of tasks for a few rows is too many partitions. On Databricks the same evidence appears in its Spark UI and in query profiles, which are documented here, not run. Next, compute: what to buy, and when not to.",
}
