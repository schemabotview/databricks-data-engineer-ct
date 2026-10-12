import type { Section } from '../types'

export const managedConnectorsLakeflowConnect: Section = {
  id: 'managed-connectors-lakeflow-connect',
  title: 'Managed connectors and Lakeflow Connect: responsibilities and source limits',
  scene: 'connector-matrix',
  focus: 'responsibility-table',
  slide: `## Choose who carries each task

**Objective:** compare writing your own ingestion with a managed connector, by responsibility.

**Model:** a **managed connector** reads a supported source for you and keeps its own progress state. You still choose the source and destination, and you still **govern** the result.

### Worked: the same order feed, two ways (documented, not run)
- Your code: you read, keep the checkpoint, handle schema change and tune load
- Managed connector: it reads and tracks progress; schema handling and limits follow **its** rules
- Either way, **you** govern the tables

### What stays yours
- Permissions, ownership, lineage and quality checks on the result
- Comparing effort to build and run, not only a price

### Misconception
- **"Managed means no limits."** Supported sources, features and source load limits vary by connector`,
  narration:
    "Sometimes you do not need to write the ingestion code at all. Databricks offers managed connectors, including Lakeflow Connect, which read from a supported source for you and keep their own progress state. I did not run any of these, so this is a comparison of responsibilities, documented, not run, and it is deliberately generic. Look at the board. If you write the ingestion yourself, you read the source, you keep the checkpoint, you choose how schema changes are handled, and you tune how much load you put on the source. With a managed connector, the connector reads the source and tracks progress, and schema handling and limits follow the connector's own rules. In both cases, you still govern the resulting tables. Permissions, ownership and lineage are still your responsibility. Compare the effort to build and run your own against the connector, not only a price. So how do you choose? Ask whether the source is supported at all. Ask what the connector cannot do. And ask how much load it may place on the source system, because a connector that runs against a busy operational database has a cost there. The misconception is that managed means no limits. Supported sources, features and limits vary by connector, so read the current documentation for the specific one. Next we look at sources that are streams of messages.",
}
