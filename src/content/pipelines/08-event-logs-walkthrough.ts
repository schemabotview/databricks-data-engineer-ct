import type { Section } from '../types'

export const eventLogsWalkthrough: Section = {
  id: 'event-logs-walkthrough',
  title: 'Pipeline event logs, failure interpretation, and an annotated pipeline walkthrough',
  scene: 'pipeline-walkthrough',
  focus: 'event-log-table',
  slide: `## Read the log before the code

**Objective:** read the whole retail pipeline, and know where a failure leaves evidence.

**Model:** every update writes an **event log**: updates starting and ending, per-flow progress, data-quality metrics and errors. It is queryable like a table. (Documented, not run.)

### Annotated (documented)
- \`bronze_orders\`: ingest, plus the source file
- \`typed_orders\`: a view that casts the text columns
- \`silver_orders\`: AUTO CDC keyed on \`order_id\`
- \`gold_sales\`: a materialized view of COMPLETED sales

### Failure kinds
- A rule set to fail: the **data** stopped the update
- A source changed in place: a **design** problem
- Neither is fixed by a plain restart

### Reading a failure
- The event-log rows shown are **illustrative**, not captured
- Find the failed flow first, then its rule or its source`,
  narration:
    "Let's read the whole retail pipeline once, from the top, and then see what it leaves behind. Bronze orders is a streaming table that ingests the CSV files and keeps the source file name. Typed orders is a view that casts the text columns to real types. Silver orders is a streaming table fed by AUTO CDC, keyed on order id, sequenced by event time and source file, so that the latest event per order wins and ties are broken the way chapter five taught. And gold sales is a materialized view that sums the completed orders per store. All of this is documented, not run. Now the evidence. Every update writes an event log, which records updates starting and ending, the progress of each flow, data quality metrics and any errors, and you can query it like a table. The rows on the board are illustrative. I wrote them to show the kind of evidence an update leaves, and they were not captured from a real pipeline, so check the real schema in the documentation. How do you read a failure? Find the failed flow first. Then ask which kind of failure it is. A rule set to fail update means the data itself stopped the run. A source table ignore changes error, which we reproduced locally, means a streaming source was changed in place. Each leaves a different trail, and neither is fixed by restarting. A pipeline manages its internal dependencies. Next we coordinate it with other workloads and with upstream and downstream responsibilities.",
}
