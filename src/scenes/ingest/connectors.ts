import type { Scene, SceneNode } from '@graphlearning/flow'

// Managed connectors (Lakeflow Connect), DOCUMENTED via search summaries: managed ingestion from SaaS
// applications and databases into Unity Catalog tables, run as pipelines. Which sources are supported,
// and with what limits, changes — check the live docs. Nothing here is run.
const col = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern'], items: string[]): SceneNode =>
  ({ id, kind: 'list', label, sub, icon, pattern, items })

export const connectors: Scene = {
  id: 'managed-connectors',
  framed: true,
  padding: 0.04,
  nodes: [
    {
      id: 'who',
      label: 'Who does what (documented, not run)',
      bare: true,
      cols: 2,
      align: 'start',
      stretch: true,
      children: [
        col('yours', 'Your own ingestion code', 'Courses 6 and 7, by hand', 'code', 'service', [
          'Connect, authenticate, page through the API',
          'Track what was read: checkpoints, cursors',
          'Map the source’s types to tables',
          'Retry, back off, alert — all yours',
          'Any source at all, at the cost of code',
        ]),
        col('managed', 'A managed connector', 'Lakeflow Connect', 'plug', 'network', [
          'Databricks runs the connection and the reading',
          'Progress and retries are managed for you',
          'Lands governed tables in Unity Catalog',
          'Only the sources and options it supports',
          'The source’s own limits still apply',
        ]),
      ],
    },
    {
      id: 'below',
      label: 'Before choosing',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'still-yours',
          kind: 'table',
          label: 'Still yours, either way',
          headers: ['responsibility', 'why'],
          values: [
            ['the source contract', 'keys, retention, owner'],
            ['what happens to deletes', 'the connector copies, you decide'],
            ['quality and reconciliation', 'a connector moves data, it does not check it'],
            ['cost', 'it runs on compute you pay for'],
          ],
        },
        {
          id: 'ask',
          kind: 'list',
          icon: 'search',
          label: 'Ask first',
          pattern: 'warn',
          items: [
            'Is the source on the supported list?',
            'Which objects, which change capture?',
            'What rate limits does the source set?',
            'Who owns the credentials it uses?',
          ],
        },
      ],
    },
  ],
  edges: [],
}
