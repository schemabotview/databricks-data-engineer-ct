import type { Scene } from '@graphlearning/flow'

// Ownership and cost attribution — DOCUMENTED (system.billing.usage with custom_tags and
// usage_metadata.job_id; tags on jobs and compute — via search summaries). The result is ILLUSTRATIVE
// and quotes no prices: units only.
const SQL = [
  '-- documented, not run: who used what, by tag',
  "SELECT custom_tags['team'] AS team,",
  '       usage_metadata.job_id AS job,',
  '       sum(usage_quantity) AS units',
  'FROM system.billing.usage',
  "WHERE usage_date >= current_date() - INTERVAL 30 DAYS",
  'GROUP BY ALL ORDER BY units DESC;',
].join('\n')

export const ownership: Scene = {
  id: 'operate-ownership',
  framed: true,
  padding: 0.03,
  align: 'start',
  nodes: [
    {
      id: 'own-top',
      label: 'own-top',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        { id: 'own-sql', kind: 'code', filename: 'cost by team — documented', label: SQL, highlight: [2, 3, 5] },
        {
          id: 'own-rows',
          kind: 'table',
          label: 'Illustrative result: units, never prices',
          headers: ['team', 'job', 'units'],
          values: [
            ['retail-data', 'retail-daily', '41.2'],
            ['retail-data', 'retail-pipeline', '18.6'],
            ['(no tag)', '—', '12.9'],
          ],
        },
      ],
    },
    {
      id: 'own-below',
      label: 'own-below',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'owners',
          kind: 'table',
          label: 'Who answers for what (illustrative)',
          headers: ['when', 'who', 'with'],
          values: [
            ['a run fails', 'on-call, retail-data', 'the alert task (Course 10)'],
            ['an objective breaks', 'the data product owner', 'the measurement (§7)'],
            ['a reader disputes gold', 'the owner of gold', 'reconciliation, lineage'],
            ['the bill grows', 'the team in the tag', 'system.billing.usage'],
          ],
        },
        {
          id: 'own-facts',
          kind: 'list',
          icon: 'scale',
          label: 'Untagged is unowned',
          pattern: 'warn',
          items: [
            'Tag every job and pipeline with its team',
            'An untagged row is a cost nobody answers for',
            'Owners are named before the first incident',
            'The bundle can set tags for every target',
          ],
        },
      ],
    },
  ],
  edges: [],
}
