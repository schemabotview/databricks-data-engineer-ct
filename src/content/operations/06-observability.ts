import type { Section } from '../types'

export const observability: Section = {
  id: 'observability',
  title: 'Observability: logs, metrics, lineage, audit records, and system-table concepts',
  scene: 'observability-sources',
  focus: 'evidence-table',
  slide: `## Know where to look first

**Objective:** match a question about a running pipeline to the evidence that answers it.

**Model:** a running system leaves **logs** (what ran), **metrics** (how much), **lineage** (what feeds what), **audit** records (who did what) and **billing** records (what it cost). **System tables** expose some of this to SQL. (Documented, not run.)

### Worked: five questions, five sources
- What did this run do? Job and task logs
- What did each flow read? The pipeline event log
- What feeds this table? Lineage. Who touched it? Audit
- What did it cost, by job? \`system.billing.usage\`, grouped by \`usage_metadata.job_id\`

### Habits
- Name the question before you open a log
- **Tag** jobs so cost and ownership can be found
- Keep lineage and audit for investigations, not only audits

### Caveats
- System tables must be **enabled and granted**
- Re-check table and column names in the docs`,
  narration:
    "When something looks wrong in production, the first skill is knowing where to look. A running system leaves several kinds of evidence. Logs say what ran. Metrics say how much. Lineage says what feeds what. Audit records say who did what. And billing records say what it cost. Databricks exposes some of this through system tables, which you can query with SQL. This is documented, not run, and the table names should be re checked. Match each question to its source. If you ask what a particular run did, look at the job and task logs. If you ask what each flow in a pipeline read, look at the pipeline event log from chapter seven. If you ask what feeds a table, use lineage, which chapter two introduced. If you ask who touched a table, use the audit records. And to ask what a job cost, the billing usage system table has a custom tags column and a usage metadata struct with the job id, so you can sum the usage quantity by job over the last week, as the query shows. The documentation confirms that table. The habits that help are to name the question before opening a log, to tag jobs so cost and ownership can be found, and to use lineage and audit records for investigations and not only for audits. There are caveats. System tables must be enabled for your account and granted to you, and the exact names and columns for the others should be checked against the live documentation. Next we turn evidence into objectives and alerts.",
}
