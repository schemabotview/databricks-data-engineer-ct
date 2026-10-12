import type { Section } from '../types'

export const failureRecoveryCritique: Section = {
  id: 'failure-recovery-critique',
  title: 'Failure and recovery critique: missing data, duplicates, drift, and access loss',
  scene: 'failure-critique',
  focus: 'critique-table',
  slide: `## Attack your own design

**Objective:** name how each realistic failure shows up, which guard stops it, and what is left.

**Model:** for each failure, ask: what is the **first sign**, what **guards** against it, and what **evidence** shows the guard works? Then list what stays unguarded.

### Worked: four failures, with evidence from earlier chapters
- **File c never arrives**: a row-count condition keeps publish from running (Chapter 8 model)
- **o4 sent twice**: keyed latest-wins with a tie-breaker (Chapter 5 test)
- **\`"12,50"\` read as 1250.00**: type rules and quarantine; it was **silent** in Chapter 4
- **Run-as loses a grant**: the job is refused; a least-privilege fix

### Still unguarded
- A decimal comma that passes a fixed schema; an alert nobody reads`,
  narration:
    "A design review should attack the design. For each realistic failure, ask three questions. What is the first sign? What guards against it? And what evidence shows that the guard works? Then list what is still unguarded. Take four failures, with evidence from earlier chapters. First, missing data. If file c never arrives, a row count condition keeps the publish task from running, and nothing is published from a short load. That evidence came from the chapter eight model. Second, duplicates. If order four is sent twice, keyed latest wins, with a tie breaker, keeps one row, and chapter five tested that with twelve shuffles. Third, drift. In chapter four, the text twelve comma fifty was read as twelve hundred fifty, silently, with no error. The guard is type rules with a quarantine, and the lesson is that it failed quietly, so the rules must be there before the data arrives. Fourth, access loss. If the run as principal loses a grant, the job is refused. The fix is a least privilege grant, as chapters two and eight showed. Now be honest about what is unguarded. A decimal comma can still pass a fixed schema. An alert that nobody reads is not a guard. And a source can expire before you replay. Naming the gaps is part of the design. Next we write down the decisions.",
}
