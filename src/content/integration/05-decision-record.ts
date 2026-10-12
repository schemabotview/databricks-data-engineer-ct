import type { Section } from '../types'

export const decisionRecord: Section = {
  id: 'decision-record',
  title: 'Decision record: alternatives, guarantees, cost assumptions, and unresolved risks',
  scene: 'decision-record',
  focus: 'risk-list',
  slide: `## Write the decision down

**Objective:** record each design decision with its alternative, its guarantee and what is still unknown.

**Model:** a **decision record** states what was chosen, what was rejected and why, what it **guarantees**, what it **assumes** about cost, and the **risks left open**.

### Worked: the retail design
- Keyed \`MERGE\` into silver, **instead of** append and hope: idempotent replay
- **SCD type 2** for orders, instead of overwrite: history survives corrections
- Gold clustered by store, instead of date partitions: fewer files opened
- Run as a **service principal**, not a person: least privilege

### Revisit it
- When a requirement, a source or a platform feature changes

### Unresolved
- Unity Catalog, Auto Loader, pipelines and Jobs were **not run**; cost is **assumed**; platform wording needs live-docs checks`,
  narration:
    "The last thing a design needs is a written record of its decisions. A decision record says what was chosen, what was rejected and why, what the choice guarantees, what it assumes about cost, and what risks remain open. Here are four entries for the retail design. We chose a keyed merge into silver, instead of appending and hoping, and it guarantees that replays are idempotent. We chose slowly changing dimension type two for orders, instead of overwriting, so that history survives corrections like the one we saw. We chose to cluster the gold table by store, instead of partitioning by date, because the measurements in chapter nine showed far fewer files opened for a store filter. And we chose to run as a service principal, not a person, for least privilege. Revisit the record whenever a requirement, a source or a platform feature changes. Now the honest part, the unresolved risks. Large parts of this design were documented in this course and not run: Unity Catalog, Auto Loader, declarative pipelines and Jobs. The cost figures are assumptions, not measurements, and no price was quoted anywhere. Platform wording needs checking against the live documentation. And the retention of each real source is something you have to confirm. Reading this course explains how such a design is built and why. It does not show that anyone reading it can build one, and I make no claim that it does. Continue with unfamiliar sources and operating scenarios, and deepen practical competence through separate implementation experience and feedback.",
}
