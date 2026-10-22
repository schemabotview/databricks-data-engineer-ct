import type { Section } from '../types'

export const jobsAndTaskDags: Section = {
  id: 'jobs-and-task-dags',
  title: 'Jobs and task DAGs',
  scene: 'job-dag',
  narration:
    "So far, we ran every step by hand. In production, something else has to run the project every day, in the right order, and say clearly what happened. On Databricks that is Lakeflow Jobs, and this frame shows the project's job, as a bundle resource in the resources folder. It is documented, not run: jobs need a workspace, and the field names were checked against the documentation's summaries and must be checked again before use. Read the file from the top. The job is called retail daily. It takes two parameters, the run date and the number of rows we expect. It is scheduled with a cron expression, half past six every morning, London time. It runs as retail job, the service principal from course four. And it has six tasks. Ingest, transform, validate and publish each run an entry point of the project's wheel, which course twelve builds. Rows ok is a condition task: it compares two values and runs nothing. Alert runs only if something upstream failed. The graph on the right is what the depends on lines declare. Ingest feeds transform and the row check. Transform feeds validate and the alert. Publish needs both validate and a true outcome from the row check. The table lists the kinds of task a job can run, according to the documentation: a notebook, a wheel's entry point, a pipeline update like course nine's, a SQL query on a warehouse, a condition, or one task for each item of a list. The next sections run the rules of this graph, as a model, with real tables. Next, the values that flow into and between tasks.",
}
