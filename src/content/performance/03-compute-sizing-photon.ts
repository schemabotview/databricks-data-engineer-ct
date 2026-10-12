import type { Section } from '../types'

export const computeSizingPhoton: Section = {
  id: 'compute-sizing-photon',
  title: 'Compute sizing, serverless choices, Photon, and feature eligibility',
  scene: 'parallelism-sizing',
  focus: 'tasks-table',
  slide: `## Parallelism should fit the data

**Objective:** say when more parallelism helps, when it is waste, and what to check before relying on a feature.

**Model:** each shuffle partition becomes a **task**, and every task has overhead. Too many tiny tasks waste time; too few leave machines idle. **Adaptive execution** can coalesce small partitions.

### Worked: aggregating 1,000 rows (local run)
- **200** shuffle partitions: **200** reduce tasks for 1,000 rows
- **4** partitions: **4** tasks
- 200 with adaptive execution on: **1** task

### Choose by evidence
- Size shuffle partitions to the data, or let adaptive execution decide
- More machines do **not** fix one slow task

### Eligibility (documented, not run)
- **Photon** and **serverless** are choices with conditions: compute type, runtime, operators
- Check each is available and applies, then **measure**; never assume`,
  narration:
    "Compute sizing comes down to whether the amount of parallelism fits the amount of data. Every shuffle partition becomes a task, and each task has overhead. Too many tiny tasks waste time, and too few leave machines idle. Here is a local example. I aggregated just one thousand rows. With two hundred shuffle partitions, which is Spark's default, the reduce stage ran two hundred tasks for one thousand rows. With four shuffle partitions it ran four tasks. And with two hundred partitions but adaptive query execution switched on, Spark coalesced the small partitions and ran a single task. So the right setting depends on the data, and adaptive execution can fix the common over partitioned case for you. Adding machines does not fix one slow task, so resize compute only after you have found the bottleneck. Then there are the platform choices. Photon is Databricks' vectorised engine, and serverless compute is managed for you, and both come with conditions: the kind of compute, the runtime, and which operators are supported. I did not run either, so I state them generically. Check that a feature is available in your workspace and applies to your workload, and then measure the difference. Never assume that a faster engine is faster for your query. Next we look at joins and skew.",
}
