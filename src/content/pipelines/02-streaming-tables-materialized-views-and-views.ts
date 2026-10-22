import type { Section } from '../types'

export const streamingTablesMaterializedViewsAndViews: Section = {
  id: 'streaming-tables-materialized-views-and-views',
  title: 'Streaming tables, materialized views and views',
  scene: 'dataset-kinds',
  narration:
    "A pipeline declares datasets, and there are three kinds, each with a different job. The code on the left is the same datasets in pipeline SQL, again documented and not run. A streaming table, like bronze orders here, reads a stream: on each update it processes only the rows that are new since the last one, the way our checkpointed streams did. A temporary view, typed orders, stores nothing; it is a named step that other datasets in the same pipeline can read. And a materialized view, gold sales, reads its inputs as a batch and holds a result that is kept correct as those inputs change. The table on the right lines them up. A streaming table reads a stream, adds only new rows, and suits bronze and silver. A materialized view reads a batch, holds a correct full result after every update, and suits gold, joins and sums. A temporary view stores nothing and is a step in between. The list is how to choose. If the source only appends and each row needs to be read once, a streaming table. If the result must stay right as its inputs change, including updates and deletes upstream, a materialized view. The platform may refresh a materialized view incrementally or recompute it, depending on what it can prove about the query. Either way the answer is the same; only the cost differs. Next, how these definitions become a graph.",
}
