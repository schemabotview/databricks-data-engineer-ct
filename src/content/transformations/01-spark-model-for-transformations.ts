import type { Section } from '../types'

export const sparkModelForTransformations: Section = {
  id: 'spark-model-for-transformations',
  title: 'The Spark model needed here: partitions, lazy execution, actions, and shuffles',
  scene: 'spark-plan-model',
  focus: 'plan-card',
  slide: `## Lazy plans, then one job

**Objective:** say when Spark actually runs work, and why a \`GROUP BY\` moves data.

**Model:** data is split into **partitions**. **Transformations** such as \`filter\` and \`groupBy\` only build a plan. An **action** such as \`collect\` or a write runs it. Grouping needs rows with the same key together, so Spark **shuffles** them across partitions.

### Worked: counting the 11 event rows (local run)
- Building \`by_status\` started **no job**; \`collect()\` did
- The plan has one \`Exchange hashpartitioning(status, 2)\`: the shuffle
- A partial count runs before it, a final count after it
- Result: CANCELLED 1, COMPLETED 8, PENDING 2

### Misconception
- **"Each line of code runs when it is written."** Only an action runs the plan
- The full Spark model is in the Apache Spark course`,
  narration:
    "Before we transform data, we need just enough of the Spark model to read what happens. The data is split into partitions, and different tasks work on different partitions at the same time. Most of the code you write does not run when you write it. A transformation, like filter or group by, only adds a step to a plan. Nothing is computed until an action asks for a result, such as collect, count, or a write. Then Spark runs the whole plan as a job. Let's count the eleven event rows in our retail bronze table, in a local run. I built the status counts, and no job had started. Then I called collect, which is an action, and a job ran. The plan Spark printed is trimmed here for readability. It shows a partial count on each partition, then a step called exchange hash partitioning on status, then a final count. That exchange is the shuffle. To count per status, all the rows with the same status have to end up in the same place, so Spark moves data between partitions. Shuffles are the expensive step to watch in later chapters. The result is cancelled one, completed eight, pending two. Notice that eight completed is rows, not orders, because the table still has resends and bad rows. The misconception to avoid is that each line runs as written. Only an action runs the plan. The Apache Spark course covers the full model, so here I only use what I need. Next we see that SQL and the DataFrame API describe the same plan.",
}
