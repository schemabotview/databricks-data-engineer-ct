import type { Section } from '../types'

export const declarativeAutomationBundles: Section = {
  id: 'declarative-automation-bundles',
  title: 'Declarative Automation Bundles: resources, configuration, and deployment intent',
  scene: 'bundle-config',
  focus: 'bundle-yaml',
  slide: `## Deployment as a file in Git

**Objective:** read a bundle and say what it will create and where.

**Model:** a **bundle** is a \`databricks.yml\` that names the **resources** (jobs, pipelines), the **artifacts** (a wheel) and the **targets** (environments). Deploying creates or updates exactly what the file declares. (Documented, not validated.)

### Worked: the example bundle
- \`include\` pulls in \`resources/retail_daily.yml\`
- \`dev\` is \`mode: development\`; \`prod\` is \`mode: production\` and \`run_as\` a service principal
- \`validate\`, \`deploy\`, \`run\` are the commands

### What a bundle does not do
- It does not check your data or your logic
- It does not move data between environments
- A pull request on the file is a **deployment review**

### Naming
- Current name: **Declarative Automation Bundles**
- Older material: **Databricks Asset Bundles (DABs)**`,
  narration:
    "A bundle turns deployment into a file in Git. It is a configuration file, called databricks dot yml, that names the resources to create, such as jobs and pipelines, the artifacts to build, such as a wheel, and the targets, which are your environments. When you deploy, the tool creates or updates exactly what the file declares. The current name is Declarative Automation Bundles. Older material calls them Databricks Asset Bundles, or DABs, and I mention that only so you recognise it. I wrote the example bundle for our project, but it is documented, not validated. The field names follow the documentation as I could check it through search summaries, and validating a bundle needs a workspace to sign in to, which I did not have. The abridged file on the board has a name, an include line that pulls in the job definition from the resources folder, and two targets. The dev target is in development mode. The prod target is in production mode, and it runs as a service principal. The commands are validate, which checks the configuration, deploy, which creates or updates the resources, and run, which starts a job. A bundle does not check your data or your logic, and it does not move data between environments. Deployment intent lives in the file, so a review of the file is a review of the deployment. Next we look at moving it through environments.",
}
