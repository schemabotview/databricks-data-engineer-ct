import type { Scene, SceneNode } from '@graphlearning/flow'

// Schedules and triggers — DOCUMENTED (trigger kinds: scheduled (Quartz cron), file arrival, table
// update, continuous; via search summaries). The freshness table is arithmetic on a hypothetical
// 10-minute run, not a measurement, and quotes no prices.
const k = (id: string, label: string, sub: string, icon: string): SceneNode => ({ id, label, sub, icon, pattern: 'network' })

export const triggers: Scene = {
  id: 'job-triggers',
  framed: true,
  padding: 0.03,
  align: 'start',
  nodes: [
    {
      id: 'kinds',
      label: 'What starts a run (documented)',
      pattern: 'network',
      icon: 'none',
      cols: 2,
      stretch: true,
      align: 'start',
      children: [
        k('cron', 'Scheduled', 'a Quartz cron: 06:30 every day', 'calendar'),
        k('file', 'File arrival', 'new files in a watched location', 'file'),
        k('table', 'Table update', 'a source table changed', 'table'),
        k('continuous', 'Continuous', 'a new run as soon as one ends', 'repeat'),
      ],
    },
    {
      id: 'trig-below',
      label: 'trig-below',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'freshness',
          kind: 'table',
          label: 'Freshness against runs (hypothetical: each run takes 10 minutes)',
          headers: ['trigger', 'runs a day', 'oldest data in gold', 'compute a day'],
          values: [
            ['daily at 06:30', '1', 'up to 24 h 10 min', '10 min'],
            ['hourly', '24', 'up to 1 h 10 min', '4 h'],
            ['every 15 minutes', '96', 'up to 25 min', '16 h'],
            ['on file arrival', 'one per arrival', '10 min after it lands', 'per arrival'],
            ['continuous', '144', 'about 10–20 min', '24 h'],
          ],
        },
        {
          id: 'trig-facts',
          kind: 'list',
          icon: 'clock',
          label: 'Choosing one',
          pattern: 'service',
          items: [
            'Ask the readers how fresh is fresh enough',
            'Freshness is bought with runs; runs are compute',
            'File arrival suits sources that land irregularly',
            'An incremental job makes frequent runs cheap',
            'retail_daily: the stores send at night, so 06:30',
          ],
        },
      ],
    },
  ],
  edges: [],
}
