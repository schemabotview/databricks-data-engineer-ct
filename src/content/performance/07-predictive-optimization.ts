import type { Section } from '../types'

export const predictiveOptimization: Section = {
  id: 'predictive-optimization',
  title: 'Predictive optimisation and automatic maintenance: responsibilities and eligibility',
  scene: 'auto-maintenance',
  focus: 'maintenance-table',
  slide: `## Automate the upkeep, know the limits

**Objective:** say which maintenance the platform can run for you, and what still needs a person.

**Model:** the maintenance in the last two sections is routine: **compact**, **clean up**, **refresh statistics**. **Predictive optimization** is documented to run it automatically. (Documented, not run.)

### What is documented
- Runs \`OPTIMIZE\` (incremental clustering), \`VACUUM\` and \`ANALYZE\`
- Applies to **Unity Catalog managed tables** only; not in every region
- It does **not** run Z-order. **Automatic liquid clustering** needs it, plus a recent runtime

### Still yours
- Check whether it is on for your account; defaults depend on when it was created
- Retention, cost review, and checking the result`,
  narration:
    "The maintenance we have looked at, compacting files, removing old ones, and refreshing statistics, is routine, and routine work is a good candidate for automation. Databricks documents a feature for it called predictive optimization. I could not run it, so this is documented, not run, and it is based on summaries of the documentation. It runs optimize, which includes incremental clustering, vacuum, and analyze, on its own. It applies only to Unity Catalog managed tables, and it is not available in every region. It does not run Z ordering. And automatic liquid clustering, written as cluster by auto, is documented to need predictive optimization and a recent runtime. Whether it is switched on for you depends on your account. The documentation says it is on by default for accounts created after a date in November of twenty twenty four, with older accounts being moved over gradually, so check yours instead of assuming. Even with automation, some things stay with a person. Retention is a decision with consequences, as chapter three showed. Cost still needs reviewing. And someone has to check that the automation did what you expected, on the tables you care about. Next we bring it together in one worked comparison.",
}
