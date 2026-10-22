import type { Section } from '../types'

export const statefulAggregationAndDeduplication: Section = {
  id: 'stateful-aggregation-and-deduplication',
  title: 'Stateful aggregation and deduplication',
  scene: 'stream-state',
  narration:
    "To drop order four's resend, a stream has to remember every order it has already seen. That memory is called state, and this frame measures it. The tool deduplicates the same ten events twice, on the order ID and its event time. Once with no watermark, and once with the ten-minute watermark from the last section. The terminal prints, for each, how many events were kept and how many keys the state held after each batch. With no watermark, nine of ten are kept: the resend is dropped. But the state grows with every batch, three, five, seven, nine, and it never shrinks, because nothing ever says a key can be forgotten. On a real stream that runs for months, that is a stream that eventually runs out of memory. With the watermark, the state rises and falls, three, three, four, three, one. Once a key is older than the watermark, no duplicate of it can still be accepted, so it can go. Eight of ten are kept this time, because the watermark also drops late order twelve. The list says why the event time is part of the key. The watermark expires state by event time, so a deduplication key without the event time column can never expire. State is the price of asking, have I seen this before. The watermark is what keeps that price bounded. Next, the same idea with two streams: a join.",
}
