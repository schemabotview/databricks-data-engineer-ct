import type { Scene } from '@graphlearning/flow'

// §10.6 — where evidence lives. DOCUMENTED, NOT RUN. `system.billing.usage` (with custom_tags and
// usage_metadata.job_id) is confirmed by search summaries of the docs; the audit and lineage table names
// were not confirmed there and must be re-verified. System tables must be enabled and granted.
export const observabilitySources: Scene = {
  id: 'observability-sources',
  title: 'Where the evidence lives',
  flow: 'TB',
  nodes: [
    {
      id: 'evidence-table',
      kind: 'table',
      label: 'Evidence sources',
      sub: 'documented, not run',
      headers: ['Evidence', 'Answers'],
      values: [
        ['job and task logs', 'what did this run do?'],
        ['pipeline event log', 'what did each flow read?'],
        ['lineage', 'what feeds this table?'],
        ['audit records', 'who touched it?'],
        ['billing usage', 'what did it cost, by job?'],
      ],
    },
    {
      id: 'usage-query',
      kind: 'code',
      filename: 'cost_by_job.sql  (documented, not run)',
      label: `SELECT usage_metadata.job_id,
       sum(usage_quantity) AS units
FROM system.billing.usage
WHERE usage_date >= current_date() - 7
GROUP BY usage_metadata.job_id;`,
    },
  ],
  edges: [{ source: 'evidence-table', target: 'usage-query' }],
}
