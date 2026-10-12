import type { Section } from '../types'

export const workedComparison: Section = {
  id: 'worked-comparison',
  title: 'Worked comparison: freshness, runtime, throughput, and cost assumptions',
  scene: 'cost-comparison',
  focus: 'cost-table',
  slide: `## Cost is assumptions times measurements

**Objective:** compare layouts on cost with every assumption written down.

**Model:** cost = **work done** x **assumed rate**. The work, here **files opened**, is measured. The rate, time per file, machines and runs per day are **assumptions**, and they must be stated.

### Worked: one store filter (hypothetical)
- Assume **3 s** per file, **2** machines, **1 unit** per machine-hour, **24** runs a day
- Unclustered, **24** files: **0.96** units a day. Compaction only, **2**: **0.08**
- Clustered by store, **1**: **0.04**. Partitioned by date, **720**: **28.80**

### Limits
- No price is quoted, and scan time is **not** really proportional to files
- A one-off rewrite to cluster the table is real cost not shown here`,
  narration:
    "Let's finish by comparing the layouts on cost, with every assumption written down. The idea is simple. Cost is the work done multiplied by an assumed rate. The work, here the number of files a query opens, we measured in the last two sections. The rest is assumption, and the assumptions must be stated, because without them the numbers mean nothing. I assume it takes three seconds to open a file, that the job uses two machines, that a machine costs one unit per hour, and that the query runs twenty four times a day. None of these is a price or a measurement. With those assumptions, the unclustered table, which opens twenty four files, costs ninety six hundredths of a unit a day. Compaction alone, which opens two, costs eight hundredths. The table clustered by store, which opens one, costs four hundredths. And the table partitioned by date, which opens seven hundred twenty files for this filter, costs twenty eight point eight units a day. The ratios are real consequences of the file counts, but the sizes are only as good as the assumptions. Scan time is not really proportional to the number of files, and rewriting the table to cluster it is a real cost that this table does not show. A measured comparison on your workload is the only honest one. Performance changes must survive deployment and failure. Next we connect development, access, monitoring and recovery into an operational process.",
}
