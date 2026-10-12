import type { Scene } from '@graphlearning/flow'

// §11.5 — a decision record for the retail design. The decisions and their guarantees come from Chapters
// 1-10; the COST assumptions are hypothetical and no price is quoted. The unresolved risks are real limits
// of this course: whole classes of the design were documented, not run.
export const decisionRecord: Scene = {
  id: 'decision-record',
  title: 'A decision record for the retail design',
  flow: 'TB',
  nodes: [
    {
      id: 'decision-table',
      kind: 'table',
      label: 'Decisions, guarantees, assumptions',
      sub: 'cost assumptions hypothetical',
      headers: ['Decision', 'Instead of', 'Guarantee'],
      values: [
        ['keyed MERGE into silver', 'append and hope', 'idempotent replay'],
        ['SCD type 2 for orders', 'overwrite', 'history survives corrections'],
        ['cluster gold by store', 'partition by date', 'fewer files opened'],
        ['run as a service principal', 'a person', 'least privilege'],
      ],
    },
    {
      id: 'risk-list',
      kind: 'list',
      label: 'Unresolved risks',
      items: [
        'Unity Catalog, Auto Loader, pipelines, Jobs: not run',
        'cost is assumed, not measured',
        'platform wording needs live-docs checks',
        'retention of each source unconfirmed',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'decision-table', target: 'risk-list' }],
}
