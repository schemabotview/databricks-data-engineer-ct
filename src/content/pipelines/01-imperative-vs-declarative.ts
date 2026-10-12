import type { Section } from '../types'

export const imperativeVsDeclarative: Section = {
  id: 'imperative-vs-declarative',
  title: 'Imperative Spark applications versus declarative pipeline definitions',
  scene: 'imperative-vs-declarative',
  focus: 'who-handles',
  slide: `## Declare the result, not the plumbing

**Objective:** say what a pipeline definition leaves to the platform, and what stays yours.

**Model:** an **imperative** application starts streams, sets checkpoints and orders steps itself. A **declarative pipeline** states each dataset as a query, and the platform works out **order**, **checkpoints**, **retries** and **updates**.

### Worked: one ingestion, twice (documented, not run)
- Application: a stream, a checkpoint path, a sink, all wired by you
- Pipeline: one \`CREATE OR REFRESH STREAMING TABLE\` over \`read_files\`
- Business logic, such as rules and keys, is **still yours** in both

### Naming
- Current name: **Lakeflow Spark Declarative Pipelines**
- Older material says **Delta Live Tables (DLT)** and \`import dlt\``,
  narration:
    "So far we have written streaming and merge logic by hand. A declarative pipeline lets you state each dataset as a query, and leaves the plumbing to the platform. In an imperative application, you start the stream, choose the checkpoint path, decide the order of steps, and handle the retries. In a declarative pipeline, you write something like create or refresh streaming table, followed by a query, and the platform works out the order, keeps the checkpoints, retries failures, and runs the updates. Look at the same ingestion written both ways on the board. The application wires up a stream, a checkpoint path and a sink. The pipeline is a single statement over the read files function. I want to be clear about the status of this chapter. I had no Databricks workspace, so every pipeline example is documented, not run, and I checked names against documentation search summaries only. Please verify them on the live docs before publishing. Whichever style you use, the business logic, such as the quality rules and the keys, is still yours. A word about naming. The current name is Lakeflow Spark Declarative Pipelines. Older material calls it Delta Live Tables, or DLT, and uses an import called dlt, and I mention those only so you recognise them. Next we look at the kinds of dataset a pipeline can contain.",
}
