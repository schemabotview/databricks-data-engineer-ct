import type { Scene } from '@graphlearning/flow'

// §11.3 — three ways to build the same flow, compared by responsibility. DOCUMENTED, NOT RUN: drawn from
// Chapters 4, 7 and 8. This is a comparison for the retail example, not a ranking.
export const designOptions: Scene = {
  id: 'design-options',
  title: 'Jobs and notebooks, pipelines, or managed ingestion',
  flow: 'TB',
  nodes: [
    {
      id: 'options-table',
      kind: 'table',
      label: 'Three ways to build the flow',
      sub: 'documented, not run',
      headers: ['Option', 'You write', 'Platform handles'],
      values: [
        ['Jobs + notebooks', 'every step, merge, retry safety', 'scheduling, retries'],
        ['Declarative pipelines', 'datasets and rules', 'order, state, updates'],
        ['Managed ingestion', 'source and destination', 'reading, progress state'],
      ],
    },
    {
      id: 'leaves-to-you',
      kind: 'table',
      label: 'What each leaves to you',
      sub: 'documented, not run',
      headers: ['Option', 'Still yours'],
      values: [
        ['Jobs + notebooks', 'idempotency, state'],
        ['Pipelines', 'keys, sequence, rules'],
        ['Managed ingestion', 'source limits, governance'],
      ],
    },
    {
      id: 'retail-choice',
      kind: 'list',
      label: 'A defensible retail choice',
      items: [
        'managed ingestion if the source is supported',
        'a pipeline for silver and gold',
        'a job to order, guard and alert',
        'notebooks or code only where custom',
      ],
      framed: true,
    },
  ],
  edges: [
    { source: 'options-table', target: 'leaves-to-you' },
    { source: 'leaves-to-you', target: 'retail-choice' },
  ],
}
