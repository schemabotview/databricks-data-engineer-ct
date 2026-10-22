import type { Section } from '../types'

export const targetsCiAndPromotion: Section = {
  id: 'targets-ci-and-promotion',
  title: 'Targets, CI and promotion',
  scene: 'operate-promotion',
  narration:
    "A change should reach production by one path, and the same path every time. The chain across the top is that path, as documented. An engineer works in dev, with per-user names. A push starts CI. CI deploys to staging, a copy of production with its own catalog. And after an approval, the same commit is deployed to prod, where it runs as retail job. The file underneath is a sketch of the CI step, a GitHub workflow, and it is not run here, so every step is unverified. It checks out the code, sets up Python and Java, installs the requirements and the test extra, and runs the seven tests locally first. Only then does it install the Databricks command-line tool, validate the bundle against staging, and deploy it there. The credentials are a service principal's OAuth secret, stored as repository secrets, never in the file. The list on the right is about rolling back, which is where code and data differ. Rolling back code is easy: deploy the previous commit again. But that does not undo what the bad version wrote. A bad table can be restored with Delta's restore, from course five. Silver and gold can be rebuilt from bronze. And the rule that prevents most of this: promote nothing that skipped staging. Next, how to see what production is doing.",
}
