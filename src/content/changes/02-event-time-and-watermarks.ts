import type { Section } from '../types'

export const eventTimeAndWatermarks: Section = {
  id: 'event-time-and-watermarks',
  title: 'Event time and watermarks',
  scene: 'event-time-watermarks',
  narration:
    "Ten events, but they do not arrive in the order they happened. Each carries its own time, the event time, and this frame sums sales into ten-minute windows by that time, not by when a file landed. The highlighted watermark is the stream's rule for late data: wait ten minutes behind the latest event time seen, and no longer. Each batch reads one file. The terminal shows each batch's watermark and what it wrote. The first batch has none yet. After it, the latest event was nine fourteen, so the watermark becomes nine oh four. As later events arrive, the watermark moves to nine thirteen, nine twenty-one and nine thirty-four. A window is written once the watermark passes its end, so in append mode each window appears exactly once, when it is final. The nine o'clock window is written in batch two as ninety-five. The ten past window in batch three, as one hundred and ten. And the twenty past window, ten, in the last batch. The table on the right follows the late events. Order ten happened at nine oh six but arrived in batch two, while its window was still open, so it is counted in the nine o'clock window. Order twelve happened at nine oh two but arrived in batch three, after its window had already been written and closed, so it is dropped, silently. And order four was sent twice, so the ten past window counts it twice: a watermark does not deduplicate. The list gives the trade. A longer wait catches more late events, and writes every window later. Next, removing that duplicate, and what it costs to remember.",
}
