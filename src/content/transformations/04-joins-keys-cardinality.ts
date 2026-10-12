import type { Section } from '../types'

export const joinsKeysCardinality: Section = {
  id: 'joins-keys-cardinality',
  title: 'Joins, keys, cardinality, and duplicate amplification',
  scene: 'join-cardinality',
  focus: 'join-compare',
  slide: `## A duplicate key inflates a total

**Objective:** predict how many rows a join returns, and catch a duplicate key before it does damage.

**Model:** a join returns one row per **matching pair**. If the key is unique on one side, the other side keeps its rows. If it repeats, the rows **multiply**.

### Worked: orders joined to stores (local run)
- Completed orders: **5** rows, sales **170.00**
- Join to the clean \`stores\`: **5** rows, **170.00**
- Join to \`stores_dup\`, where York arrived twice: **6** rows, **185.00**
- o4 (15.00, store 9) was counted **twice**

### Fix, then verify
- Remove or reject the duplicate reference row
- Re-run: **5** rows and **170.00** again

### Guard
- Check the key before the join: \`HAVING count(*) > 1\` returned **9 | 2**
- Nothing raised an error`,
  narration:
    "A join returns one row for every matching pair. If the key is unique on one side, the other side keeps the number of rows it had. If the key repeats, the rows multiply, and any total built on them is inflated. Here is a local example from our retail data. We have five completed orders worth one hundred and seventy dollars in all. Join them to the clean stores table, where each store appears once, and you get five rows and one hundred and seventy. Now suppose the stores reference file was sent twice, so York, store nine, appears two times. The same join returns six rows and a total of one hundred and eighty five. Order four, fifteen dollars from store nine, was counted twice. Nothing raised an error. The query is valid, the types are right, and the answer is wrong by fifteen. The defence is to check the key before the join. A query that groups the reference table by store id and keeps only groups with more than one row returns store nine with a count of two, which tells you the key is not unique. Then you decide what to do about it, and re-run to confirm five rows and one hundred and seventy again. Then you decide what to do about it: remove the duplicate, or reject the file. The habit is to know the grain of both sides of every join, and to reconcile the output total to a known figure. Next we handle duplicates in the events themselves.",
}
