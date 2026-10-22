import type { Scene, SceneNode } from '@graphlearning/flow'

// The finished retail-lakehouse as a map of the course (docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md).
// Each piece names the course that builds it. The gold numbers are the Course 7 result (11 events,
// local run); nothing on this frame claims a platform run.
// A leaf carries no badge, so the course that builds a piece is the end of its sub line.
const step = (id: string, course: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode =>
  ({ id, label, sub: `${sub} · Course ${course}`, icon, pattern })
const course = (id: string, label: string): SceneNode => ({ id, label, variant: 'chip', pattern: 'user', icon: 'none' })

export const build: Scene = {
  id: 'retail-lakehouse',
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'flow',
      label: 'retail-lakehouse',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'sources',
          label: 'Sources',
          sub: 'landed in cloud storage',
          pattern: 'external',
          icon: 'none',
          children: [
            step('orders', '6', 'Order files', 'one CSV or JSON file per arrival, resends included', 'file', 'external'),
            step('cdc', '8', 'Order changes', 'a CDC feed from the till system: inserts, updates, deletes', 'repeat', 'external'),
            step('stores', '7', 'Stores', 'reference data: 7 Leeds, 9 York, 12 Hull', 'building', 'external'),
          ],
        },
        {
          id: 'tables',
          label: 'Delta tables, in one catalog',
          sub: 'governed by Unity Catalog — Course 4',
          pattern: 'storage',
          icon: 'layers',
          flow: 'LR',
          children: [
            step('bronze', '6', 'bronze', 'what arrived, as it arrived', 'database', 'storage'),
            step('silver', '7', 'silver', 'typed, deduplicated, quarantined, enriched', 'funnel', 'storage'),
            step('history', '8', 'order history', 'every version, kept as SCD type 2', 'history', 'storage'),
            step('gold', '7', 'gold', 'completed sales per city', 'sigma', 'storage'),
          ],
          edges: [
            { source: 'bronze', target: 'silver' },
            { source: 'silver', target: 'gold' },
            { source: 'silver', target: 'history' },
          ],
        },
        {
          id: 'out',
          label: 'Consumers',
          bare: true,
          children: [
            {
              id: 'result',
              kind: 'table',
              label: 'gold_sales, the sample day',
              headers: ['city', 'orders', 'sales'],
              values: [
                ['Leeds', '3', '75.00'],
                ['York', '1', '15.00'],
                ['Hull', '1', '80.00'],
              ],
            },
            step('readers', '1', 'Finance, stores, analysts', 'each with its own freshness and correctness', 'barchart', 'user'),
          ],
        },
      ],
      edges: [
        { source: 'sources', target: 'tables', label: 'ingest' },
        { source: 'tables', target: 'out', label: 'grants' },
      ],
    },
    {
      id: 'run',
      label: 'How it runs',
      sub: 'the platform half: documented here, not run',
      pattern: 'network',
      icon: 'none',
      span: 'all',
      cols: 4,
      children: [
        step('pipeline', '9', 'Declarative pipeline', 'the tables as definitions', 'workflow', 'network'),
        step('job', '10', 'Scheduled job', 'ingest → transform → validate → publish', 'clock', 'network'),
        step('measure', '11', 'Measured', 'files read, layout, cost assumptions', 'gauge', 'network'),
        step('bundle', '12', 'Bundle and tests', 'deployed to dev, staging, prod; monitored', 'package', 'network'),
      ],
    },
    {
      id: 'around',
      label: 'Around the project',
      pattern: 'user',
      icon: 'none',
      span: 'all',
      cols: 5,
      children: [
        course('c2', '2 · How the platform runs'),
        course('c3', '3 · Start the project'),
        course('c5', '5 · Make the table reliable'),
        course('c8', '8 · Handle change'),
        course('c13', '13 · Defend the design'),
      ],
    },
  ],
  edges: [],
}
