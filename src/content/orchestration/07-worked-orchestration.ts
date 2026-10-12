import type { Section } from '../types'

export const workedOrchestration: Section = {
  id: 'worked-orchestration',
  title: 'Worked orchestration: ingest, transform, validate, and publish dependencies',
  scene: 'orchestration-walkthrough',
  focus: 'run-history-table',
  slide: `## The whole job, designed to be rerun

**Objective:** design a four-task job whose every task is safe to repeat.

**Model:** order the tasks by what each needs, make each **idempotent by design**, and let a **condition** guard publication. Then recovery is a matter of choosing a scope.

### Worked: the retail daily job
- \`ingest\`: merge on file and order. \`transform\`: overwrite silver
- \`validate\`: read-only. \`publish\`: merge on \`run_date\`
- Run 1: transform failed once, so validate and publish were skipped
- A **repair** ran the other three: published **1 row, 160.00**

### Checklist
- Run as a **service principal** with the least privileges
- Parameters for environments; a condition for short loads`,
  narration:
    "Let's design the whole retail job so that any recovery is safe. We order the tasks by what each one needs. Ingest depends on nothing, and it writes bronze with a merge on the file name and the order id, so reading the same files twice changes nothing. Transform depends on ingest, and it overwrites silver, so running it again gives the same result. Validate depends on transform and only reads. Publish depends on validate, and on the row count condition from section two, and it merges on the run date, so a retry cannot add a second row. In the local model, run one had transform fail once. Ingest had succeeded, validate and publish were skipped, and the alert ran. Then a repair run re ran only transform, validate and publish. Ingest was not run again. The published table ended with one row, one hundred and sixty dollars, and bronze held eight rows. Because every task is safe to repeat, a full rerun would have given the same result, and that is what makes a failure boring. The rest of the checklist comes from this chapter. Run as a service principal with the least privileges. Put the environment in parameters. And let a condition stop publication when the load is short. Distinguish this from the exactly once business effects discussed earlier. The orchestration only repeats tasks. Your writes decide whether repeating is harmless. The work is coordinated. Next we inspect execution evidence and choose improvements that meet latency and cost requirements.",
}
