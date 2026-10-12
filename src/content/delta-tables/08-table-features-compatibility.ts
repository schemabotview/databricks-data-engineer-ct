import type { Section } from '../types'

export const tableFeaturesCompatibility: Section = {
  id: 'table-features-compatibility',
  title: 'Table features, reader/writer compatibility, and platform versus open-format behaviour',
  scene: 'table-features',
  focus: 'protocol-table',
  slide: `## Features raise the bar for clients

**Objective:** explain why enabling a feature can change who can read or write a table.

**Model:** a table's **protocol** names the minimum reader and writer versions and the **table features** clients must understand. Using a feature can raise the protocol.

### Worked: three tables (local run)
- A plain table: reader **1**, writer **2**
- Adding a \`CHECK\` constraint: writer **3**, feature \`checkConstraints\`
- Enabling the change feed: writer **7**, feature \`changeDataFeed\`

### Platform versus open format
- Delta is an open format; Databricks adds features and runtime requirements
- Check a feature's requirements before sharing a table with another engine

### Before enabling a feature
- Ask which clients must still work, and whether the protocol rises`,
  narration:
    "A Delta table is read and written by many kinds of clients, and they are not all equally new. The table's protocol is how it says what a client must understand. It records a minimum reader version, a minimum writer version, and a set of named table features. Using a feature can raise those numbers. Let's read them from three tables in a local run, using describe detail. A plain table has reader version one and writer version two. When I added a check constraint to another table, its writer version became three, and a feature called check constraints appeared. When I enabled the change data feed on a third table, its writer version became seven, and the feature list included change data feed. Every table also listed append only and invariants. The practical meaning is that a client older than the protocol may be unable to write the table, or in some cases to read it. Now, Delta is an open format, but the platform around it moves at its own pace. Databricks adds features and has runtime requirements for them, and which ones apply depends on the runtime and the feature. I could not run the platform, so treat any platform specific feature as documented, not run. Before you enable something, ask which clients must still work, whether it raises the protocol, and whether another engine needs to read the table. We now have a governed, transactional destination. Next we bring source data into it incrementally and account for imperfect inputs.",
}
