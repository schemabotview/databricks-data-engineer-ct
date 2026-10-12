import type { Section } from '../types'

export const partitioningClusteringSkipping: Section = {
  id: 'partitioning-clustering-skipping',
  title: 'Partitioning, liquid clustering, data skipping, and pruning',
  scene: 'skipping-layouts',
  focus: 'files-read-table',
  slide: `## A layout helps the filters it was built for

**Objective:** match a layout to the filters a table really gets, and read the evidence.

**Model:** Delta records min and max values per file, so a query can **skip** files that cannot match. **Clustering** (Z-order or liquid) sorts rows so each file covers a narrow range. **Partitioning** puts rows in separate folders that a filter can prune.

### Worked: files opened by \`store_id = 7\` (local run)
- Unclustered: **24 of 24**. Compaction alone: **2 of 2**
- Z-order or liquid clustering by \`store_id\`: **1 of 19**
- Filtering \`customer_id = 5\` on either: **19 of 19**
- Partitioned by date: **720 of 720**

### Choosing
- Filters used often: cluster by those columns
- Partition only when each partition holds a lot of data

### Not interchangeable
- Each tool wins on different filters, write patterns and costs`,
  narration:
    "A layout is useful only for the filters it was built for, and the evidence in this section is the clearest in the chapter. Delta keeps the minimum and maximum value of each column for every file, so a query can skip files that cannot contain a match. For that to work, rows with similar values have to be stored together. Clustering does that, whether it is Z ordering or liquid clustering. Partitioning does something different: it puts rows into separate folders that a filter can prune. Here is the count of files opened by a query for store seven, in a local run on one million orders. With no layout, it opened all twenty four of twenty four files. Compaction alone gave two files, and the query still opened both, because compacting does not sort. After Z ordering by store, the table had nineteen files, and the same query opened one. Liquid clustering by store gave the same result, one of nineteen. But filter on customer instead, a column the layout was not built for, and both opened all nineteen. And the table partitioned by date opened all seven hundred twenty files, because the filter was not on the partition column. Cluster by the columns used in filters, partition only when each partition holds a lot of data, and with many access patterns expect to measure. So these are not interchangeable recipes. They differ in which filters they help, how they handle writes, and what they cost to maintain. Choose by the filters your table actually gets. Next we look at automating the upkeep.",
}
