import type { Section } from '../types'

export const streamingTablesViews: Section = {
  id: 'streaming-tables-views',
  title: 'Streaming tables, materialized views, and views: different responsibilities',
  scene: 'dataset-kinds',
  focus: 'kinds-table',
  slide: `## Three datasets, three jobs

**Objective:** pick the right dataset kind for a step.

**Model:** a **streaming table** reads a stream and processes each input **once**, so it suits ingestion. A **materialized view** stores the result of a query and keeps it up to date. A **view** stores nothing and is computed when read.

### Worked: the retail pipeline (documented, not run)
- \`bronze_orders\`: streaming table, appends each new file once
- \`typed_orders\`: view, a reusable cast step inside the pipeline
- \`gold_sales\`: materialized view, a summary over silver

### Choosing
- Append each new file once: streaming table
- A result that must stay current: materialized view
- A step to name and reuse: view

### Misconceptions
- **"A materialized view is a table I write to."** It is defined by its query`,
  narration:
    "A pipeline is made of datasets, and there are three kinds with different jobs. A streaming table reads a stream and processes each piece of input once. That makes it the natural choice for ingestion and for steps that only append. A materialized view stores the result of a query, and the platform keeps it up to date, so it suits summaries and joins. A view stores nothing. It is a named query, computed when something reads it, and it is useful for sharing a step inside the pipeline. In the retail pipeline, bronze orders is a streaming table that appends each new file once. Typed orders is a view, a reusable step that casts the text columns. And gold sales is a materialized view that summarises the silver table. The code shows how each is declared, though it is documented, not run. Two misconceptions. A materialized view is not a table that you write rows into. It is defined by its query, and you do not insert into it. And a view does not save compute. It saves storage, because the query runs again every time it is read. So choose by responsibility: streaming tables for ingestion and append only steps, materialized views for results that must stay current, and views for steps you want to name and reuse. Next we see how these datasets connect.",
}
