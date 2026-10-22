import type { Scene, SceneNode } from '@graphlearning/flow'

// Updates and refreshes, DOCUMENTED (a triggered update, refresh of selected datasets, full refresh;
// a full refresh of a streaming table clears it and reprocesses its source — via search summaries).
// `pipelines.reset.allowed` is UNVERIFIED and labelled so. The retention arithmetic is Course 6's
// source contracts (order files kept 30 days).
const step = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon, pattern })

export const refresh: Scene = {
  id: 'pipeline-refresh',
  framed: true,
  padding: 0.03,
  align: 'start',
  nodes: [
    {
      id: 'scopes',
      label: 'Three ways to run the graph (documented)',
      pattern: 'network',
      icon: 'none',
      flow: 'LR',
      children: [
        step('update', 'Update', 'every dataset: new rows only for streaming tables, a correct result for views', 'zap', 'network'),
        step('selected', 'Refresh selected', 'only the datasets you name, and nothing else', 'funnel', 'network'),
        step('full', 'Full refresh', 'clear streaming tables, re-read their sources from the start', 'repeat', 'warn'),
      ],
      edges: [],
    },
    {
      id: 'refresh-below',
      label: 'refresh-below',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'replays',
          kind: 'table',
          label: 'What a full refresh of bronze_orders replays',
          headers: ['if the landing volume holds', 'bronze after a full refresh'],
          values: [
            ['every file ever sent', 'the same rows again'],
            ['30 days of files (the source contract)', 'only the last 30 days'],
            ['a file that was since deleted', 'that file’s rows are gone'],
          ],
        },
        {
          id: 'refresh-facts',
          kind: 'list',
          icon: 'ban',
          label: 'Before a full refresh',
          pattern: 'warn',
          items: [
            'It rebuilds from what the source still holds',
            'Bronze may be the only copy of older data',
            'Protect such tables from a reset (a table setting)',
            'pipelines.reset.allowed: name unverified, re-check',
            'Refresh the views downstream, not the bronze table',
          ],
        },
      ],
    },
  ],
  edges: [],
}
