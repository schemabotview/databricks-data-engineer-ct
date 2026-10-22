import type { Section } from '../types'

export const autoCdcAndScd: Section = {
  id: 'auto-cdc-and-scd',
  title: 'AUTO CDC and SCD',
  scene: 'auto-cdc',
  narration:
    "Course eight wrote change handling by hand, in the cdc module: a merge on the key, guarded by the sequence, with deletes as flags. A pipeline can declare the same thing with AUTO CDC, the current name for what used to be apply changes into. The code on the left is documented, not run. It declares a streaming table, orders history, and a flow into it from the stream of order changes. Keys says what identifies a row: the order ID. Apply as delete when says which records are deletes. Sequence by says which record is newer: the sequence number. Columns except leaves the operation and sequence out of the result. And stored as SCD type two keeps every version. The table underneath maps each clause to the code it replaces. Keys is the merge condition on the order ID. Sequence by is the guard that a record must be newer than the row. Apply as delete is the deleted flag. The newest record per key within a batch, which our apply did with a row number, is handled by the flow. And SCD type two is the valid from and valid to of course eight. The table on the right shows what the result would hold, and it is illustrative: course eight's real versions, written in the documented column names, start at and end at. The list is the important part. Declaring it does not make the decisions for you. The key and the sequence are still yours. A tie in the sequence still needs a tie-breaker. Type one or type two must still be chosen before history is lost. And the changes still have to arrive first. Next, refreshes, and what they replay.",
}
