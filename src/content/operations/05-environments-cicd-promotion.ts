import type { Section } from '../types'

export const environmentsCicdPromotion: Section = {
  id: 'environments-cicd-promotion',
  title: 'Development/staging/production targets, CI/CD, validation, and promotion',
  scene: 'promotion-rollback',
  focus: 'target-table',
  slide: `## One change, three environments

**Objective:** describe how a change is validated, promoted, and undone.

**Model:** each environment is a **target**. A change is **validated** on a pull request, **deployed** to staging and exercised there, then promoted to production by the same file. (Documented, not run.)

### Worked: the example's path
- \`dev\`: development mode, resources named for the developer
- \`staging\`: a service principal runs it; the job is exercised
- \`prod\`: production mode; deploy-time checks apply

### Validation before promotion
- Tests and \`bundle validate\` on every pull request
- Staging runs the real job before production does

### Rolling back
- **Redeploy the previous commit** to roll back code
- Code rolls back; **data does not**: a bad write needs its own recovery (Chapters 3 and 6)`,
  narration:
    "A change should travel from a developer's laptop to production the same way every time. In a bundle, each environment is a target. On a pull request, the tests run, and the bundle is validated against staging. When the change is merged, the bundle is deployed to staging and the job is exercised there. Then the same file is deployed to production. The sketch on the board is a sketch of a pipeline, not a validated one. The documentation describes what the modes do. Development mode prefixes resource names with the deployer and marks them as development, so developers do not collide. Production mode adds checks at deploy time, including that the git branch matches the target, and the documentation recommends running production under a service principal. Before promotion, tests and validate run on every pull request, and staging runs the real job before production does. How do you roll back? You redeploy the previous commit, which is one more reason deployment lives in git. But be careful, because that is a rollback of code, not of data. If a bad version already wrote bad rows, redeploying the old code does not remove them. That needs its own recovery, using the tools from chapters three and six, such as restore and replay. Know that difference before the day you need it. Next we look at seeing what a running system is doing.",
}
