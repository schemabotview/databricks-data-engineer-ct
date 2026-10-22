import type { Section } from '../types'

export const ownershipAndCostAttribution: Section = {
  id: 'ownership-and-cost-attribution',
  title: 'Ownership and cost attribution',
  scene: 'operate-ownership',
  narration:
    "The last section of this course is about people again: who answers when something goes wrong, and who pays. The query on the left is documented, not run. It reads the billing usage system table, groups usage by a custom tag called team and by the job that used it, over the last thirty days. The result beside it is illustrative and in units, never prices. The retail data team's daily job, its pipeline, and a row with no tag at all. That last row is the warning. A cost with no tag is a cost nobody answers for, which is why the list says to tag every job and pipeline with its team, something the bundle can do for every target. The table underneath names who answers for what, again illustrative. When a run fails, the on-call engineer of the retail data team, alerted by the job's alert task from course ten. When an objective breaks, the owner of the data product, with the measurement from section seven. When a reader disputes a number in gold, the owner of gold, with the reconciliation and the lineage. And when the bill grows, the team in the tag, with the billing table. The point is to name owners before the first incident, not during it. That completes the project: built, tested, packaged, deployed, observed and owned. The final course steps back and defends the whole design.",
}
