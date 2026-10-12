import type { Section } from '../types'

export const conditionsFailurePaths: Section = {
  id: 'conditions-failure-paths',
  title: 'Conditional execution, loops, dependencies, and failure paths',
  scene: 'failure-paths',
  focus: 'status-trace',
  slide: `## One failure, five different outcomes

**Objective:** predict the status of every task after one task fails.

**Model:** by default a task runs only if **all** its upstream tasks succeeded. Other **run if** conditions let a task run on failure or regardless. Upstream failure makes a dependent **skipped**.

### Worked: transform fails once (local model)
- \`ingest\`: **SUCCEEDED**; \`transform\`: **FAILED**
- \`validate\` and \`publish\`: **SKIPPED**, not failed
- \`alert\`, set to run if **at least one failed**: **SUCCEEDED**

### Reading the statuses
- **FAILED**: it ran and broke
- **SKIPPED**: an upstream failure stopped it
- A task whose condition was false did not run, and is not an error

### Also available (documented)
- **If/else** tasks branch on a value; **for each** tasks loop over inputs`,
  narration:
    "What happens to the rest of the graph when one task fails? By default, a task runs only if all the tasks it depends on succeeded. If an upstream task failed, the dependent task is skipped, which is different from failed. It simply did not run. You can change that with a run if condition. The documented options include all succeeded, which is the default, at least one succeeded, none failed, all done, at least one failed, and all failed. Here is one run, from a local model of those rules. Ingest succeeded. Transform failed once, from a transient fault that I injected. Validate and publish depend on transform, so both were skipped. I also added an alert task that depends on transform and has the run if condition at least one failed, and it ran and succeeded. That is a failure path: a task that exists to run when something else goes wrong. Jobs also have if else tasks, which branch on a value, and for each tasks, which loop over a list of inputs. A task whose condition was false also did not run, and that is a decision, not an error. There is a trap in the skipped status. A skipped task did not run, so it tells you nothing about whether its work would have been fine. Do not read skipped as checked and healthy. Next we look at how to recover from this failure.",
}
