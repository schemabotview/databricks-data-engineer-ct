import type { Section } from '../types'

export const eventLogsAndAWalkthrough: Section = {
  id: 'event-logs-and-a-walkthrough',
  title: 'Event logs and a walkthrough',
  scene: 'pipeline-event-log',
  narration:
    "Every pipeline keeps an event log: one row for each thing that happened, every update, every flow, every expectation. It is a table, and the query on the left reads it through the event log function for one of the pipeline's tables. This query is documented, not run, and the log's exact schema is unverified, so it must be checked before it is relied on. The table beside it is illustrative. It is not output from a platform. It shows what an update would report if one rule, the positive amount, were a fail rule instead of a drop rule, built from this course's own numbers. The update starts. Bronze orders completes with eleven rows. Silver orders fails. And the update fails. The table underneath walks that back to a cause. Which update failed: the update progress events, in time order. Which dataset: the flow progress event that says failed. Which rule: the failure's details name it, amount positive. Which row: the rule's condition leads to bronze, and order eight, with an amount of minus five, from course seven. And what was written: nothing for silver, because a fail rule stops the update before it writes. The list says what the log is for. Every update, flow and expectation leaves an event. Warn and drop leave counts, which is how you would know that three rows were dropped on a quiet day. Fail leaves the stop. And because it is a table, you can query it, and alert on it. Next course, how the pipeline runs every day: jobs and schedules.",
}
