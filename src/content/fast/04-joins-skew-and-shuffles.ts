import type { Section } from '../types'

export const joinsSkewAndShuffles: Section = {
  id: 'joins-skew-and-shuffles',
  title: 'Joins, skew and shuffles',
  scene: 'fast-joins-skew',
  narration:
    "Most of the work in a slow query is data moving between machines, the shuffle. The tool joins the million orders to a fifty-row stores table and sums sales per store, and it reports two things from the physical plan: which join Spark chose, and how many shuffles it needs. The first line is the default: a broadcast hash join, with one shuffle. The stores table is small, so Spark copies it to every task, and the million orders never move for the join; the only shuffle is the group by. The next line turns broadcasting off. Spark falls back to a sort-merge join, and now there are three shuffles: both sides of the join, then the group by. The answer is the same, as the line says, but a million rows crossed the network twice more to get it. The second half is skew. With stores spread evenly, the largest of four partitions holds about three hundred and twenty thousand rows. Move eighty percent of the orders onto store seven, and the largest partition holds eight hundred and fifty-five thousand, because every row of one key must land in the same partition. Salting adds a random-looking number, from zero to sixty-three, to the key, so store seven is split sixty-four ways, and the largest partition falls back to three hundred thousand. The parts are summed afterwards. The list collects the rules. Broadcast small sides. Know that a hot key concentrates work in one task. Salt it, or let adaptive execution split a skewed join, which was turned off here so the plans stay fixed. Next, small files.",
}
