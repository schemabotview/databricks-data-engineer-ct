import type { Section } from '../types'

export const ownershipIncidentWalkthrough: Section = {
  id: 'ownership-incident-walkthrough',
  title: 'Operational ownership, capacity, cost attribution, and an incident walkthrough',
  scene: 'ops-ownership',
  focus: 'incident-timeline',
  slide: `## Every control needs an owner

**Objective:** assign owners to the controls in this chapter, and read an incident against retention.

**Model:** a control with no owner fails silently. Name an owner and the **evidence** they use. Attribute **cost** with tags so spend has a team.

### Worked: the responsibility matrix (a proposal)
- Pipeline code: data engineering, Git history. Deployment: the CI principal
- Quality objective: the product owner. Cost: the team lead, from billing by tag

### Capacity and cost
- Capacity: how much work fits in the schedule window
- **Tag** jobs so spend maps to an owner

### Hypothetical incident (assumed numbers)
- Source keeps files **7 days**. Ingestion fails on day 0 with **no alert**
- Noticed on day **5**: **2** days of replay left. Fixed day 6: **1** day left
- Noticed on day 8, day 0's data would be **gone**`,
  narration:
    "A control that nobody owns fails silently, so the last step is to name owners and the evidence they use. Here is a proposal for the retail data product. Pipeline code belongs to data engineering, and its evidence is the git history. Deployment belongs to the continuous integration service principal, with the deploy log as evidence. The quality objective belongs to the product owner, who watches the quality metrics. And cost belongs to the team lead, who uses billing records grouped by tag, so each job's spend has a team. Capacity is how much work fits in the schedule window, and tags let spend map to an owner. That is a design proposal, not a standard. Now an incident, with assumed numbers, to show why detection time matters. Suppose the source keeps its files for seven days. On day zero, ingestion fails, and there is no alert. On day five, finance notices a gap. Now we are five days behind, and only two days of replay window remain. On day six it is fixed and the backfill starts, with one day left. If it had been noticed on day eight, day zero's data would have expired at the source and been lost. The numbers are hypothetical, but the arithmetic is the point: the replay window shrinks every day you do not notice. So alert on freshness, and know your retention. Individual controls are now connected. Next we assess a complete data product under changed requirements and realistic failures.",
}
