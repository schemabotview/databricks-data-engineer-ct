import type { Section } from '../types'

export const retriesRepairAndIdempotency: Section = {
  id: 'retries-repair-and-idempotency',
  title: 'Retries, repair and idempotency',
  scene: 'job-repair',
  narration:
    "After a failure there are three ways back, and each has a different effect on the data. This frame runs all three on the model, with real Delta tables. First, a repair. The documentation says a repair run re-runs only the tasks that failed or were skipped, and keeps the ones that succeeded. The terminal shows it: bronze has eight rows, published has one row of one hundred and sixty, and ingest ran once. Second, a full rerun, which starts every task again, ingest too. With an append ingest, bronze now holds sixteen rows: every file was loaded twice. Silver still holds six, but only because transform happens to use distinct. That is luck, not design. With a merge ingest, keyed on the file and the order, bronze stays at eight. Third, a retry after a write that committed. Publish writes its row and then fails, as a timeout after the write would. The task is retried once. With an append, the day now has two rows in the published table. With a merge on the run date, it has one. The table on the right puts the three side by side. The list states the rule the documentation is clear about: the platform does not make tasks idempotent. A repair helps only when the failed task's own write is safe to run again. Every write that a retry or rerun can reach should be a merge or an overwrite on a key, so that running it twice gives the same table as running it once. Next, whose permissions a run uses.",
}
