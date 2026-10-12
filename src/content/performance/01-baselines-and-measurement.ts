import type { Section } from '../types'

export const baselinesAndMeasurement: Section = {
  id: 'baselines-and-measurement',
  title: 'Correctness baselines, representative workloads, and measurement limits',
  scene: 'baseline-checks',
  focus: 'checksum-table',
  slide: `## Check the answer before the speed

**Objective:** make a performance comparison that cannot reward a wrong answer.

**Model:** a **baseline** is the correct result of a representative workload, with a checksum. A change is only faster if the **result is unchanged**. Compare **counts** you can repeat, because **timings** vary.

### Worked: one million orders, five layouts (local run)
- Every layout returned **1,000,000** rows and \`sum(amount)\` **50,497,436.00**
- Unclustered, Z-ordered, liquid clustered, and partitioned by date or by customer
- A layout that changed either number would be **wrong**, not fast

### Measurement limits
- Same data, same query, same compute; change **one** thing
- Repeat runs: a single timing is an anecdote
- This chapter quotes **counts**, never timings`,
  narration:
    "Chapter nine is about making things faster and cheaper, and the first rule is to check the answer before the speed. A baseline is the correct result of a representative workload, with a checksum. A change only counts as faster if the result stays the same, and a layout that changes the answer is wrong, not fast. Here is the baseline for this chapter, from a local run. I generated one million orders, with a hash based generator so the data is identical every time, and stored them five ways: with no layout, Z ordered, liquid clustered, partitioned by order date, and partitioned by customer. Every layout returned exactly one million rows and a sum of amount of fifty million four hundred ninety seven thousand four hundred thirty six dollars. That is the checksum every later comparison has to match. Then there are the limits of measurement. Compare like with like: the same data, the same query, and the same compute, and change one thing at a time. Timings vary from run to run, even on the same machine, so a single timing is an anecdote. For that reason, this chapter quotes counts you can repeat, such as files opened, rows per partition and tasks per stage, and it never quotes a timing. Next we look at how to find where the work goes.",
}
