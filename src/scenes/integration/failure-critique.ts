import type { Scene } from '@graphlearning/flow'

// §11.4 — a critique of the design against four realistic failures, citing the evidence earlier chapters
// produced. Each row's evidence is a LOCAL result or a LOCAL MODEL from that chapter, as labelled there;
// nothing here ran on Databricks. Drift and the decimal comma are real local results from Chapter 4.
export const failureCritique: Scene = {
  id: 'failure-critique',
  title: 'Four failures and what the design does about each',
  flow: 'TB',
  nodes: [
    {
      id: 'critique-table',
      kind: 'table',
      label: 'Failure, guard, evidence',
      sub: 'results from earlier chapters',
      headers: ['Failure', 'Guard', 'Evidence'],
      values: [
        ['file c never arrives', 'row-count condition', 'publish excluded (Ch 8 model)'],
        ['o4 sent twice', 'keyed latest-wins', 'tie-break test (Ch 5)'],
        ['"12,50" becomes 1250.00', 'type rules, quarantine', 'silent in Ch 4'],
        ['run-as loses a grant', 'least-privilege fix', 'refused (Ch 2, 8 model)'],
      ],
    },
    {
      id: 'unguarded-list',
      kind: 'list',
      label: 'Still unguarded',
      items: [
        'a decimal comma passes a fixed schema',
        'an alert nobody reads',
        'a source that expires before replay',
      ],
      framed: true,
    },
    {
      id: 'first-signs',
      kind: 'list',
      label: 'First signs to watch',
      items: ['publish excluded: a short load', 'a rule reason appears: bad data', 'a grant error: identity or access'],
      framed: true,
    },
  ],
  edges: [
    { source: 'critique-table', target: 'first-signs' },
    { source: 'first-signs', target: 'unguarded-list' },
  ],
}
