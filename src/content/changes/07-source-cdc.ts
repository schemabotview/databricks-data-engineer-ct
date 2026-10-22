import type { Section } from '../types'

export const sourceCdc: Section = {
  id: 'source-cdc',
  title: 'Source CDC',
  scene: 'source-cdc',
  narration:
    "So far, every event was a new fact. A change feed from a source system is different: it describes changes to rows we already hold. The till system sends change records for orders one to three. Each record has an operation, insert, update or delete, and a sequence number that orders the changes for one order. The table on the right shows the eight records, in three batches, as they arrived. The third batch is the hard one. It holds an update for order one with sequence two, which arrived after sequence three, so it is late. And it repeats order three's insert, after order three was deleted. The first line of the terminal applies the records naively, in arrival order, with a plain merge and real deletes. The result is wrong twice. Order one shows pending, because the late update overwrote the newer one. And order three is back, resurrected by the repeated insert. The editor shows the project's answer, source retail cdc. The highlighted merge updates a row only when the record's sequence is newer than the one the row already holds. A delete only sets a flag, so the row and its sequence survive, and a late insert cannot undo it. Before merging, apply keeps the newest record per order within the batch. The last three lines apply the batches in order, reversed, and replayed twice. All three give the same table: order one completed, order two completed, order three deleted. Order of arrival no longer matters. Next, what to do with the history these changes describe.",
}
