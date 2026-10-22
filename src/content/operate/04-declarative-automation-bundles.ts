import type { Section } from '../types'

export const declarativeAutomationBundles: Section = {
  id: 'declarative-automation-bundles',
  title: 'Declarative Automation Bundles',
  scene: 'operate-bundles',
  narration:
    "Everything that makes up the project in a workspace, its job, its pipeline, its wheel, and who may run and read them, can be declared in one file in the repository, and deployed from it. Databricks calls this a bundle; the product is Declarative Automation Bundles, once called Databricks Asset Bundles. The file on the left is the project's bundle. It is documented and not validated, because validating a bundle needs a workspace, so every field must be checked before use. Read it from the top. The bundle is named retail lakehouse. It includes the resources folder, which holds the job from course ten and the pipeline from course nine. It builds one artifact, the wheel, the same way section two did. It declares a variable, the catalog. And it has three targets. Dev is in development mode, which the documentation says prefixes names per user and pauses schedules, and uses a dev catalog. Staging has its own catalog. Prod is in production mode, runs as the retail job service principal, and lets finance view. The table on the right lists each part and what it says. The list draws the point. The project's code, its jobs and its pipelines live in one folder and change in one commit. Validate checks the bundle, and deploy puts it into a workspace. And the same files deploy to every target; only the target's settings differ. Next, moving a change from dev to production.",
}
