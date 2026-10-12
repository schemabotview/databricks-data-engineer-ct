import type { Section } from '../types'

export const jobsAndTaskDags: Section = {
  id: 'jobs-and-task-dags',
  title: 'Jobs and task DAGs: notebook, pipeline, SQL, and packaged-code roles',
  scene: 'job-dag',
  focus: 'task-chain',
  slide: `## A job is a graph of tasks

**Objective:** read a job definition and say what each task does and what it waits for.

**Model:** a **job** runs **tasks**, each of a type: notebook, pipeline, SQL, or packaged code. Tasks form a **DAG**: a task starts when the tasks it depends on allow it. (Documented, not run.)

### Worked: the retail daily job
- \`ingest\`: a pipeline task over the landing files
- \`transform\`: SQL or a notebook that builds silver
- \`validate\`: checks on silver; \`publish\`: writes gold
- Each \`depends_on\` names the task before it

### Why a graph
- Independent tasks can run side by side
- A failure stops only what depends on it

### Choosing a task type
- Pipeline for managed datasets, SQL for set logic, notebook for code, wheel or JAR for tested packages
- The job coordinates; the tasks **do the work**`,
  narration:
    "A pipeline manages its own internal dependencies. But a real data product involves more than one pipeline, and that is what a job is for. A job runs tasks, and each task has a type. A notebook task runs Python or SQL logic. A pipeline task runs a declarative pipeline like the one in chapter seven. A SQL task runs a query on a warehouse. And a packaged code task runs a Python wheel or a JAR. The tasks form a directed acyclic graph, which means each task starts when the tasks it depends on allow it, and there are no cycles. As always in this chapter, the examples are documented, not run, because I had no workspace, and the field names should be checked against the live documentation. Here is the retail daily job. Ingest is a pipeline task over the landing files. Transform is SQL or a notebook that builds silver. Validate runs checks on silver, and publish writes gold. Each task names the task before it in its dependencies. A graph also means independent tasks can run side by side, and a failure stops only what depends on it. How do you choose a type? Use a pipeline for managed datasets, SQL for set logic, a notebook for code, and a wheel or JAR when the code is a tested package. Remember that the job only coordinates. The tasks do the work, and the work still has to be correct and safe to repeat. Next we look at how values move between tasks.",
}
