import type { Section } from '../types'

export const streamingJoins: Section = {
  id: 'streaming-joins',
  title: 'Streaming joins',
  scene: 'stream-joins',
  narration:
    "Orders are paid separately, and payments arrive on their own stream. This frame joins the two, an order to a payment made within fifteen minutes of it. Both streams carry a watermark, and the join condition carries a time bound, the highlighted between. Together they tell each side how long to keep its rows waiting for a match. The tool runs the join twice, as an inner join and as a left outer join, and prints each batch's output. Orders one and two match in the first batch, four and five in the second, with order four twice because it was sent twice, then eleven and thirteen. The two joins agree until the very last batch, where the outer join writes order ten as unpaid. Order ten was paid at nine thirty, twenty-four minutes after it was placed, so it can never match within fifteen. The outer join can only say so once the watermark has passed the end of its window, which is why that row comes last. The table on the right covers the others. Order six was never paid, but its fifteen minutes have not yet passed the watermark when the files run out, so it is still waiting in state. And order twelve was too late to enter the join at all. The list is the rule. Each side keeps its rows until no match can still come, and the time bound plus the watermarks decide when that is. Without a bound, both sides would be kept forever. Next, the folder that holds all of this state: the checkpoint.",
}
