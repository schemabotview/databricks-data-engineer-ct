import type { Section } from '../types'

export const parametersTaskValues: Section = {
  id: 'parameters-task-values',
  title: 'Parameters, task values, and environment-specific inputs',
  scene: 'parameters-values',
  focus: 'propagation-table',
  slide: `## Values flow in, across and into decisions

**Objective:** trace how a parameter and a task value reach the task that uses them.

**Model:** **job parameters** are inputs to a run, such as \`run_date\`. A task can **set a value** for later tasks, such as \`rows_read\`. A **condition** task compares a value and decides what runs. (Syntax documented, not run.)

### Worked: two runs through the same job (local model)
- All 3 files: ingest sets \`rows_read = 8\`; \`rows_ok\` is **true**; publish **runs**
- File c missing: \`rows_read = 6\`; \`rows_ok\` is **false**; publish is **excluded**
- Nothing is published from a short load

### Environment inputs
- Dev, staging and prod differ in **parameters**, not in code
- Keep paths, catalogs and dates out of the logic`,
  narration:
    "Jobs are reusable because their inputs are not hard coded. A job parameter is an input to a run, such as the run date. Inside a task you refer to it with a double brace reference to the job parameter. A task can also set a value for the tasks after it, called a task value, for example the number of rows it read, and a downstream task reads that value with a similar reference. I should be clear that the reference syntax here is documented, not run, and the exact spelling for task values is something to re verify. A condition task then compares a value and decides what runs. To see the flow, I ran a small local model of these rules, with real row counts. In the first run all three files were present, so ingest read eight rows and set rows read to eight. The condition said at least eight, which is true, so publish ran. In the second run, file c had not arrived. Ingest read six rows, the condition was false, and publish was excluded. Nothing was published from that short load, which is exactly the point. The condition turned a data problem into a controlled decision. The same idea handles environments. Development, staging and production should differ in their parameters, such as paths, catalogs and dates, and not in their code. Next we look at when jobs should start.",
}
