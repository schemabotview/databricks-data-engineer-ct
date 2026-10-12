import type { Scene } from '@graphlearning/flow'

// §8.3 — kinds of trigger and the run count each implies. Trigger names are DOCUMENTED, NOT RUN (job
// triggers are scheduled/periodic, file arrival, table update and continuous). The run counts are
// ILLUSTRATIVE ARITHMETIC for an assumed three files a day, not a measurement, and no price is implied.
export const triggersFreshness: Scene = {
  id: 'triggers-freshness',
  title: 'When should the job start?',
  flow: 'TB',
  nodes: [
    {
      id: 'trigger-table',
      kind: 'table',
      label: 'Four ways to start a job',
      sub: 'documented, not run',
      headers: ['Trigger', 'Starts when', 'Fits'],
      values: [
        ['Scheduled', 'a cron time arrives', 'predictable reports'],
        ['File arrival', 'a new file lands', 'data that arrives in bursts'],
        ['Table update', 'an input table changes', 'chained data products'],
        ['Continuous', 'always, restarts itself', 'lowest latency'],
      ],
    },
    {
      id: 'run-count-table',
      kind: 'table',
      label: 'Runs per day, assumed 3 files',
      sub: 'illustrative arithmetic',
      headers: ['Choice', 'Runs/day'],
      values: [
        ['hourly schedule', '24'],
        ['file arrival', '3'],
        ['nightly schedule', '1'],
      ],
    },
  ],
  edges: [{ source: 'trigger-table', target: 'run-count-table' }],
}
