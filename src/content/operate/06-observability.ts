import type { Section } from '../types'

export const observabilitySection: Section = {
  id: 'observability',
  title: 'Observability',
  scene: 'operate-observability',
  narration:
    "Once the job runs every morning without anyone watching, the evidence of what it did has to be somewhere you can query. The query on the left reads the documented job run timeline system table for the retail daily job, with the table's name to be re-checked before use. The result beside it is illustrative, built from course ten's failure path: two good days around a day when transform failed. The table underneath lists four kinds of evidence, as documented. Logs say what one run printed. Metrics say how much and how fast, in the Spark UI and query profiles from course eleven. Lineage says what fed what, from Unity Catalog in course four. And system tables keep every run and every cost, in schemas called system. The list makes the point that matters most for a data pipeline. A green run can still publish wrong numbers: a job that succeeds while the data is wrong is the failure that monitoring of the job alone never sees. So log the reconciliation on every run, eleven equals six plus one plus one plus three, so a change in it is visible. Keep the pipeline's expectation counts from course nine. And alert on a breach of what the readers were promised, not only on a failed task, which is the next section. Next, objectives, measured.",
}
