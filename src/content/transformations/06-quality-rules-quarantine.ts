import type { Section } from '../types'

export const qualityRulesQuarantine: Section = {
  id: 'quality-rules-quarantine',
  title: 'Data-quality rules, quarantine, and reconciliation boundaries',
  scene: 'quality-quarantine',
  focus: 'recon-table',
  slide: `## Rules decide what enters silver

**Objective:** state quality rules as checks, and prove each row went somewhere.

**Model:** a **rule** is a test a row passes or fails. Failing rows go to **quarantine** with a reason; passing rows continue. A **reconciliation** shows every input row in exactly one place.

### Worked: the 11 event rows (local run)
- Readable amount fails **o7**; positive amount fails **o8**; known store fails **o9**
- **8** rows pass. After keeping the latest per order, **6** become silver
- **11 = 6 + 1 resend + 1 superseded o6 + 3 quarantined**

### What quarantine keeps
- The original values, the reason, the source file and the time
- An owner, and a way to replay after a fix

### Boundary
- Rules say a row is **valid**, not that it is **right**
- Silver counts are checked here; business meaning is checked in gold`,
  narration:
    "Now let's put quality rules in front of the silver table. A rule is a test that a row either passes or fails. Rows that fail go to quarantine, kept with a reason, and rows that pass continue. And then we reconcile, which means showing that every input row ended up in exactly one place. Here are our eleven event rows, in a local run, against four rules. Is the amount readable? Order seven fails, because its amount is the text n slash a. Is the amount positive? Order eight fails, because its amount is minus five. Is the store known? Order nine fails, because store fifteen is not in the reference table. And is the status one of the allowed values? Nothing fails that. So three rows are quarantined, each with its reason, and eight rows pass. Of those eight, order four appears twice and order six appears twice, so keeping the latest per order leaves six rows. Now the reconciliation. Eleven equals six silver orders, plus one identical resend of order four, plus one superseded earlier event for order six, plus three quarantined rows. Every row is somewhere. Quarantine should keep the original values, the reason, the source file and the time, and it needs an owner and a way to replay after a fix. There is also a boundary to be clear about. A rule can say a row is valid. It cannot say the row is right. Silver is checked for valid structure here, and the business meaning is checked when we build gold. Next we shape the output for the people who read it.",
}
