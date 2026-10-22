import type { Section } from '../types'

export const runAsIdentities: Section = {
  id: 'run-as-identities',
  title: 'Run-as identities',
  scene: 'job-run-as',
  narration:
    "Every run is somebody. Whatever a task reads or writes, it does with the privileges of the job's run as identity, and our job runs as retail job, the service principal from course four. This frame checks that before the first scheduled run, using course four's grant model, which reads the project's grants file. The model prints its matrix first: finance reads gold only, engineers read and write bronze and silver, and retail job reads bronze and silver and writes silver. Then the tool asks what this job actually needs. Ingest writes bronze: refused, because retail job lacks modify on the bronze schema. Transform writes silver: allowed. Publish writes gold: refused, lacking use schema and modify on gold. Course four's grants were written for a job that only refined bronze into silver. This job also ingests and publishes, and the model found both gaps before the first run at half past six, rather than at it. The table on the right names the three identities. Ana is a person, who writes and deploys the project. Retail job is a service principal, used by every scheduled run. And finance is a group, reading gold. The list says what follows. Run as decides whose privileges every task uses, so it should be a service principal, not the person who happened to deploy the job, whose access may change. The fix is a decision: grant modify on bronze and gold to retail job, or split the job so each part runs with only what it needs. Either way, each grant should name the task that needs it. Next, the whole flow, orchestrated.",
}
