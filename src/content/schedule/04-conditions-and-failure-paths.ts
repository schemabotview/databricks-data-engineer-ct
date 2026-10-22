import type { Section } from '../types'

export const conditionsAndFailurePaths: Section = {
  id: 'conditions-and-failure-paths',
  title: 'Conditions and failure paths',
  scene: 'job-failure-paths',
  narration:
    "When one task fails, every task after it has to decide what to do, and that decision is part of the job's design. The editor shows the model's rule, written from the documentation. For each task, it collects the states of its upstream tasks. By default, a task runs only if all of them succeeded. A task with a run if of at least one failed runs only if one of them failed. If a task does not run, it is excluded when a condition said no, and skipped otherwise. The terminal runs the job with a fault injected into transform. Ingest succeeds. Transform fails. Validate is skipped, because its upstream failed, and so is publish. Rows ok succeeds, because it depends only on ingest. And the alert succeeds: its rule is at least one failed, and transform did. The last lines are the run's log, the fault and the alert it caused. The table on the right gives the reason for each state. The list draws the lesson. All succeeded is the default, so one failure stops everything after it, which is what you want for publish: nothing reaches the readers from a broken run. A failure path, like the alert, has to be designed in, with a run if. Skipped and excluded mean different things: upstream failed, against a condition said no. And the run as a whole fails, and says which task broke. This is a model of documented rules, with real Spark in each task, and it proves nothing about the platform. Next, how to recover from a failure without making things worse.",
}
