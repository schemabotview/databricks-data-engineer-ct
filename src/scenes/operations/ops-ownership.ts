import type { Scene } from '@graphlearning/flow'

// §10.10 — who owns what, and a HYPOTHETICAL incident timeline. The responsibility matrix is a design
// proposal for the retail data product. The timeline uses ASSUMED numbers: the source keeps files 7 days,
// ingestion fails on day 0, and the failure is noticed on day 5, leaving 2 days of replay window.
export const opsOwnership: Scene = {
  id: 'ops-ownership',
  title: 'Owners, and an incident that nearly lost data',
  flow: 'TB',
  nodes: [
    {
      id: 'owner-matrix',
      kind: 'table',
      label: 'Responsibility matrix',
      sub: 'a design proposal',
      headers: ['Area', 'Owner', 'Evidence'],
      values: [
        ['pipeline code', 'data engineering', 'Git history'],
        ['deployment', 'CI principal', 'deploy log'],
        ['quality objective', 'product owner', 'quality metrics'],
        ['cost', 'team lead', 'billing by tag'],
      ],
    },
    {
      id: 'incident-timeline',
      kind: 'table',
      label: 'Incident timeline',
      sub: 'hypothetical: source keeps 7 days',
      headers: ['Day', 'Event', 'Replay left'],
      values: [
        ['0', 'ingestion fails, no alert', '7 days'],
        ['5', 'finance notices a gap', '2 days'],
        ['6', 'fixed, backfill starts', '1 day'],
        ['8', 'would have lost day 0 data', 'none'],
      ],
    },
  ],
  edges: [{ source: 'owner-matrix', target: 'incident-timeline' }],
}
