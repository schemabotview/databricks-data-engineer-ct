import type { Section } from '../types'

export const notebooksPipelinesIngestion: Section = {
  id: 'notebooks-pipelines-ingestion',
  title: 'Compare notebooks/jobs, declarative pipelines, and managed ingestion',
  scene: 'design-options',
  focus: 'options-table',
  slide: `## Choose by who carries the work

**Objective:** compare three ways to build the flow by what you write and what the platform handles.

**Model:** the more of the plumbing the platform carries, the less you write and the less you control. (Documented, not run.)

### Worked: the retail flow, three ways
- **Jobs and notebooks**: you write every step, the merge and the retry safety
- **Declarative pipelines**: you write datasets and rules
- **Managed ingestion**: you name the source and destination; it reads and tracks progress

### What each leaves to you
- Jobs and notebooks: idempotency and state
- Pipelines: keys, sequence and rules
- Managed ingestion: source limits and governance

### A defensible choice
- Managed ingestion if supported; a pipeline for silver and gold; a job to order and guard`,
  narration:
    "There are three broad ways to build the retail flow, and the useful comparison is who carries the work. With jobs and notebooks, you write every step yourself, including the merge, and you are responsible for making retries safe. You get the most control and carry the most. With declarative pipelines, you write the datasets and the rules, and the platform works out the order and manages the state. With managed ingestion, you name the source and the destination, and the connector reads and tracks its own progress. As always, this comparison is documented, not run. None of them is best. Each fits a situation, and the more the platform carries, the less you write and the less you control. Each still leaves something to you: idempotency and state with jobs, keys, sequence and rules with pipelines, and source limits and governance with managed ingestion. A defensible choice for the retail example might combine them. Use managed ingestion for the source if the source is supported. Use a declarative pipeline for silver and gold, where keyed merges and quality rules are declared. Use a job to order the work, to guard publication with a condition, and to alert. And keep ordinary code only for what is genuinely custom. Notice that this is a reasoned choice, not a rule. If the source is not supported, or you need unusual parsing, the answer changes, and you should be able to say why. Next we critique the design against failures.",
}
