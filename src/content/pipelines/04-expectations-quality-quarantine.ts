import type { Section } from '../types'

export const expectationsQualityQuarantine: Section = {
  id: 'expectations-quality-quarantine',
  title: 'Expectations, quality outcomes, and quarantine design',
  scene: 'expectation-policies',
  focus: 'policy-table',
  slide: `## A rule plus a policy

**Objective:** choose a policy for each quality rule and predict what it keeps.

**Model:** an **expectation** is a boolean rule on a dataset. Its **policy** decides the outcome: **warn** keeps the row and records the counts; **drop** removes it; **fail** stops the update. Metrics are tracked for warn and drop.

### Worked: the 11 events (local arithmetic, SQL documented)
- Warn: **11** kept, failures recorded per rule
- Drop: **8** kept, **3** dropped (o7, o8, o9)
- Fail: the update **stops**; nothing is written
- o7 has a NULL amount, so it fails **both** amount rules

### Choosing a policy
- **warn** to measure first; **drop** when bad rows are expected
- **fail** when one bad row means the data cannot be trusted

### Quarantine
- Dropped rows vanish: to keep them, route failures to a **quarantine** dataset`,
  narration:
    "Chapter five wrote quality rules as filters. A pipeline gives them a name and a policy. An expectation is a boolean rule on a dataset, such as amount is not null. Its policy decides what happens to a row that breaks it. Warn, the default, keeps the row and records how many passed and failed. Drop removes the row. Fail stops the update. The documentation says metrics are tracked for warn and drop. When fail triggers, the update stops and is rolled back, so there are no metrics. I want to be honest about what the board shows. The SQL is documented, not run. The counts are local arithmetic that I computed over our eleven bronze events, applying each documented policy. They are not output from a pipeline engine. With warn, all eleven rows are kept, and the pass and fail counts are recorded per rule. With drop, eight rows are kept and three are dropped, orders seven, eight and nine. With fail, the update stops and nothing is written. Notice that order seven, with a null amount, fails both amount rules, because null is not greater than zero. Choose warn to measure first, drop when bad rows are expected, and fail when one bad row means the data cannot be trusted. One design point matters here. A dropped row simply disappears. If you need to look at it later, you need a quarantine dataset that receives the failures, so decide that before you choose drop. Next we look at what an update actually recomputes.",
}
