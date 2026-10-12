import type { Section } from '../types'

export const changeDataFeed: Section = {
  id: 'change-data-feed',
  title: 'Change data feed concepts and availability/retention boundaries',
  scene: 'change-feed',
  focus: 'feed-table',
  slide: `## Row-level changes, from a point on

**Objective:** read a change feed and say what it can and cannot replay.

**Model:** with the **change data feed** enabled, a table records row-level changes: **insert**, **update_preimage**, **update_postimage** and **delete**, each tagged with its commit version.

### Worked: three commits (local run, configured feed)
- v1 inserted o1 and o2; v2 updated o1, shown as a before and an after row; v3 deleted o2
- Reading from version 1 returns those 5 change rows
- Enabled **after** a version, asking for that version fails: \`DELTA_MISSING_CHANGE_DATA\`

### Not the same as source CDC
- It sees this table's commits, not the source system's events
- It lives in \`_change_data\` under retention, so it is **not an archive**`,
  narration:
    "Delta can also tell you what changed, row by row. If you enable the change data feed on a table, each commit also records its row level changes: inserts, deletes, and for updates both a before image and an after image. Each change carries the commit version it came from. Here is a small table in a local run, with the feed switched on by a table property. Version one inserts orders one and two. Version two updates order one from pending to completed, and the feed shows that as two rows: the pre image and the post image. Version three deletes order two. Reading the feed from version one returns five change rows. Two boundaries matter. First, the feed only exists from the moment it is enabled. On a second table where I enabled it later, asking for a version before that point failed with a missing change data error. Second, the changes are stored in a folder beside the data and are subject to retention, so a vacuum can remove them. That is why the feed is not an archive. It is also not the same thing as change data capture from a source system. It sees this table's commits, not the events the source produced. This example uses the feed configured by a table property. Whether Databricks provides one automatically for some tables is a platform behaviour I did not run, so check the current documentation. Next we look at compatibility.",
}
