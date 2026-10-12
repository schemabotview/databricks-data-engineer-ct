import type { Section } from '../types'

export const joinsSkewShuffles: Section = {
  id: 'joins-skew-shuffles',
  title: 'Join strategies, skew, shuffles, and unnecessary computation',
  scene: 'join-skew',
  focus: 'join-plans',
  slide: `## Move less data

**Objective:** pick a join strategy and recognise skew by reading the plan and the partition sizes.

**Model:** a **broadcast** join sends a small table to every task, so the large table is not shuffled. A **sort-merge** join shuffles **both** sides. **Skew** puts too many rows on one key's task.

### Worked: orders joined to 50 stores (local run)
- Default plan: **BroadcastHashJoin**, **1** shuffle (the GROUP BY)
- Broadcast off: **SortMergeJoin**, **3** shuffles; the **same answer**
- 80% of rows on store 7: largest of 4 partitions **855,480**; evenly spread **319,925**
- Salting the key 64 ways: **299,626**

### Cautions
- Salting adds a step; use it for a measured skew
- Filter and select **before** a join to move fewer rows`,
  narration:
    "Most of the cost of a join is moving data. Spark has two main strategies. A broadcast join sends a small table to every task, so the large table is not shuffled at all. A sort merge join shuffles both sides, so that matching keys land together. Here is a local run of orders joined to a table of fifty stores. By default, Spark chose a broadcast hash join, and the plan has one shuffle, which belongs to the group by afterwards. When I switched broadcasting off, the same query used a sort merge join with three shuffles, two for the join sides and one for the group by. The answer was identical. Only the data movement changed. Then skew. With eighty percent of the orders on one store, repartitioning one million rows into four partitions put eight hundred fifty five thousand rows in the largest one. Evenly spread data gave a largest partition of three hundred nineteen thousand. Adding a salt, which splits the hot key into sixty four pieces, brought the largest partition down to two hundred ninety nine thousand. Be careful with that trick. Salting adds a step and a second aggregation, so use it for a skew you have measured. And the cheapest speed up is often to filter and select before the join, so fewer rows enter it. Next we look at files.",
}
