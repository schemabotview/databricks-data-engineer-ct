import type { Section } from '../types'

export const modularCodeGit: Section = {
  id: 'modular-code-git',
  title: 'Modular code, Git integration, notebooks, and local/remote development boundaries',
  scene: 'project-layout',
  focus: 'tree-card',
  slide: `## Put the logic where it can be tested

**Objective:** structure a project so most of its logic runs, and is tested, without a workspace.

**Model:** keep transformations as **pure functions** over DataFrames, in a package. Keep reading, writing and scheduling in thin job code. **Git** holds the code and the deployment definition.

### Worked: the example project (real files)
- \`src/retail_etl/transform.py\`: functions from Chapter 5, **no I/O**
- \`tests/\`: run on **local PySpark**, no workspace
- \`resources/retail_daily.yml\` and \`databricks.yml\`: the job and where it deploys

### Boundaries
- **Notebooks** suit exploration; logic worth testing belongs in functions
- Local runs cover logic; only a workspace shows permissions, scale and scheduling`,
  narration:
    "The last chapters of this course are about running a data product for a long time, and the first habit is to structure the project so that most of its logic can be tested without a workspace. The idea is simple. Write the transformations as pure functions over data frames, in a package, with no reading or writing inside them. Keep the reading, writing and scheduling in thin job code that calls those functions. And keep everything, the code and the deployment definition, in Git. This is a real project, in the examples folder of this repository. It holds the chapter five transformations in one file, with no input or output. Its tests run on local Spark, with no workspace. And a job definition and a bundle file say what to deploy and where. Think about the boundary between local and remote. A notebook is a good place to explore, but logic that is worth testing belongs in a function. And a local run can cover the logic only. Permissions, scale and scheduling show up only in a workspace, which is why the later sections use bundles and several environments. I should say that the bundle files here are documented, not validated, because validating one needs a workspace to sign in to. Next we look at how code is packaged.",
}
