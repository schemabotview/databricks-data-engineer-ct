import type { Section } from '../types'

export const eventTimeWatermarks: Section = {
  id: 'event-time-watermarks',
  title: 'Event time, processing time, late data, and watermarks',
  scene: 'watermark-timeline',
  focus: 'watermark-table',
  slide: `## A watermark decides when a window is final

**Objective:** trace which events a windowed sum counts, and when each window is written.

**Model:** **event time** is when it happened; **processing time** is when Spark saw it. The **watermark** is the newest event time seen minus the delay you declare (10 minutes). It only moves forward.

### Worked: ten events, four files (local run, append mode)
- Watermark by batch: **09:04, 09:13, 09:21, 09:34**
- Window 09:00 written at batch 2: **95.00**. Window 09:10 at batch 3: **110.00**
- **o10** (09:06) arrived late but was **counted**; **o12** (09:02) was **dropped**
- Without a watermark o12 is counted (**100.00**), and state only grows

### The guarantee runs one way
- Data within the delay is never dropped; later data **may** still be counted`,
  narration:
    "Time is the hardest part of streaming, because there are two kinds. Event time is when something actually happened, as recorded in the data. Processing time is when Spark happened to see it. Events can arrive out of order, so a query that sums per window of event time has to decide when a window is finished. The tool for that is the watermark. Its value is the newest event time seen so far, minus the delay you declare, here ten minutes, and it never moves backwards. Here is a local run of ten order events in four files, with ten minute windows, in append mode, one file per batch. The watermark in force went from nothing, to nine oh four, then nine thirteen, nine twenty one, and nine thirty four. Append mode writes each window once, when the watermark passes its end. So window nine o'clock was written at batch two with ninety five, and window nine ten at batch three with one hundred and ten. The last batch had no data and ran only to advance the watermark. Now the two late events. Order ten, with event time nine oh six, arrived late but was still counted, because its window was still open. Order twelve, at nine oh two, arrived a batch later and was dropped. Without a watermark, order twelve is counted, but the state never shrinks. Read the guarantee carefully. Data within the delay is never dropped. Data later than that may or may not be counted. Next we look at the size of that state.",
}
