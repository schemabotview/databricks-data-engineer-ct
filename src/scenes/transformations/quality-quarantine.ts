import type { Scene } from '@graphlearning/flow'

// §5.6 — four quality rules, who fails them, and the count that reconciles. LOCAL RUN over the 11 bronze
// events. 11 = 6 silver orders + 1 identical resend + 1 superseded o6 + 3 quarantined.
export const qualityQuarantine: Scene = {
  id: 'quality-quarantine',
  title: 'Rules, quarantine and reconciliation',
  flow: 'TB',
  nodes: [
    {
      id: 'rules-table',
      kind: 'table',
      label: 'Quality rules on 11 event rows',
      sub: 'first failing rule is the reason',
      headers: ['Rule', 'Fails'],
      values: [
        ['amount is readable', 'o7'],
        ['amount is positive', 'o8'],
        ['store is known', 'o9'],
        ['status is allowed', 'none'],
      ],
    },
    {
      id: 'recon-table',
      kind: 'table',
      label: 'Where all 11 rows went',
      sub: '11 = 6 + 1 + 1 + 3',
      headers: ['Rows', 'Fate'],
      values: [
        ['6', 'silver orders'],
        ['1', 'o4 resend, identical'],
        ['1', 'o6 pending, superseded'],
        ['3', 'quarantined'],
      ],
    },
  ],
  edges: [{ source: 'rules-table', target: 'recon-table' }],
}
