import type { Section } from '../types'

export const retriesRepairIdempotency: Section = {
  id: 'retries-repair-idempotency',
  title: 'Retries, repair runs, reruns, and application idempotency',
  scene: 'repair-idempotency',
  focus: 'recovery-counts',
  slide: `## Recovery repeats work, not safety

**Objective:** choose between a retry, a repair and a full rerun, and say what each repeats.

**Model:** a **retry** re-runs one task after it fails. A **repair** re-runs the unsuccessful tasks and keeps the successful ones. A **full rerun** starts every task. The platform does **not** make tasks idempotent.

### Worked: transform failed once (local model, real counts)
- Repair: ingest **not re-run**; bronze **8**
- Full rerun with an **append** ingest: bronze **16**; with a **merge**: **8**
- A publish that wrote, then timed out, then retried: append **2** rows, merge **1**

### Choosing
- Transient fault, no side effects: **retry**
- A middle task failed, early ones are fine: **repair**
- Inputs or logic changed upstream: **full rerun**
- Only **idempotent** writes make any of them safe`,
  narration:
    "There are three ways to recover, and each repeats a different amount of work. A retry runs one task again after it fails. A repair run runs only the unsuccessful tasks again, meaning the failed ones and the ones skipped because of them, and it keeps the results of tasks that already succeeded. A full rerun starts every task from the beginning. The documentation is explicit about one thing. The jobs system does not make tasks idempotent, so if a task wrote part of its output before failing, running it again can duplicate that output. I tested those ideas on a local model with real Delta tables. Transform failed once. A repair run re ran transform, validate and publish, but did not re run ingest, so bronze stayed at eight rows. A full rerun with an ingest that appends gave sixteen rows in bronze, the same eight rows twice. A downstream distinct step hid the duplicates, which is worse, because nothing complained. With an ingest that merges on the file and the order, the same full rerun left eight. Then retries. A publish task wrote its row, and then timed out. The retry wrote again. With an append, that left two published rows. With a merge on the run date, one. So choose a retry for a transient fault with no side effects, a repair when a middle task failed and the early ones are fine, and a full rerun when inputs or logic changed upstream. The misconception is that recovery is safe by construction. Only idempotent writes make it so, and that is a design decision. Next we look at who the job runs as.",
}
