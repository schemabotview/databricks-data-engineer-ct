import type { Section } from '../types'

export const computeChoices: Section = {
  id: 'compute-choices',
  title: 'Compute choices: serverless, classic workloads, and SQL warehouses',
  scene: 'compute-choice',
  focus: 'retail-choices',
  slide: `## Pick compute for the work

**Objective:** match a workload to a compute family and say what that choice assumes.

**Model:** **serverless** is managed by Databricks, **classic** is configured by you in your cloud account, and a **SQL warehouse** is built for SQL and dashboards.

### Worked: the retail flow, provisionally
- **Nightly ingest and transform:** a serverless job, because it is short and bursty
- **Analyst and dashboard queries:** a SQL warehouse
- **Needs a specific runtime or tuning:** classic compute
- These are starting points. Chapter 9 revisits them with measurements.

### Misconception and caveat
- **"Serverless is always cheaper."** Idle time and rate both matter, so compare on the workload, not the label
- Which options exist depends on the workspace and region, so verify before relying on one`,
  narration:
    "Compute is where your code actually runs, and Databricks offers three families. Serverless compute is managed by Databricks, so you give it work and the platform provisions and scales it. Classic compute is configured by you, in your own cloud account, so you choose things like the machine sizes and the runtime version. A SQL warehouse is compute built for SQL queries and dashboards. It also comes in serverless and classic styles. Let's make provisional choices for the retail flow. The nightly job that ingests and transforms the orders is short and bursty, so a serverless job is a reasonable first choice. The analysts and the store dashboard run SQL, so a SQL warehouse suits them. If some job needs a specific runtime or cluster level tuning, classic compute is where you get that control. I call these provisional on purpose. They are starting points, and chapter nine returns to them with real measurements. There is one belief to avoid, that serverless is always cheaper. What you pay depends on both the rate and the idle time, so the honest answer comes from comparing on your own workload. And which options you actually have depends on your workspace and region, so verify that before you depend on one. This course quotes no prices for that reason. Next we write a first query and read its result.",
}
