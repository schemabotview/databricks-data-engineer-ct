import type { Section } from '../types'

export const parametersAndTaskValues: Section = {
  id: 'parameters-and-task-values',
  title: 'Parameters and task values',
  scene: 'job-parameters',
  narration:
    "A job passes small values around, and this frame shows the two kinds. Parameters come in from the job: the run date, and the expected number of rows. Task values are set by one task and read by another. Since there is no workspace, the editor shows a model of the documented rules, with real Spark inside each task. Ingest reads the landed files, writes bronze, and sets a task value, rows read. The condition task, rows ok, compares that value with the expected rows parameter, and records its outcome. And publish depends on validate and on rows ok's outcome being true. The terminal runs the job twice. With all three files, ingest reads eight rows, eight is at least eight, the condition is true, and publish succeeds. With file c not yet landed, ingest reads six rows, the condition is false, and publish is excluded. Excluded is a different state from skipped: nothing failed, a condition simply said no, so the run itself is not a failure. Ingest and validate still succeeded. The table on the right summarises who sets each value and who reads it. The list shows how the documentation writes these references: double braces around job dot parameters dot run date, and around tasks dot ingest dot values dot rows read. The call that sets a task value from code is in the documentation as dbutils dot jobs dot task values, and its exact spelling must be checked before use. The rules here are a model; the eight and six are real counts. Next, what starts a run at all.",
}
