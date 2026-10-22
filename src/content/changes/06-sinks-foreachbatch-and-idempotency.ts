import type { Section } from '../types'

export const sinksForeachBatchAndIdempotency: Section = {
  id: 'sinks-foreachbatch-and-idempotency',
  title: 'Sinks, foreachBatch and idempotency',
  scene: 'sinks-idempotency',
  narration:
    "The checkpoint commits a batch only after its write has returned. So if the stream crashes after writing but before committing, the restarted stream runs the same batch again. That is called at-least-once, and this frame shows what it does to two kinds of sink. Inside foreach batch, the tool writes every batch twice: appended to one table, and merged into another on the order ID and event time. After writing batch two, it crashes on purpose, once. The terminal shows the state after the crash: eight rows in the append sink, and seven in the merge sink, because the merge already dropped order four's resend. Then the stream restarts. Batch two runs again, then batch three. The append sink now holds twelve rows for ten events: batch two's rows are there twice. The merge sink holds nine, the nine unique events, exactly what it would hold if nothing had crashed. The table on the right is the comparison. The list says where the responsibility sits. The checkpoint guarantees that no batch is lost. It cannot guarantee that a batch is written only once, because the write and the commit are two different steps. Making a replayed batch harmless is the sink's job. A merge on the key does it. An append does not. Next, change records from a source, where the order of arrival cannot be trusted at all.",
}
