import type { Scene } from '@graphlearning/flow'

// §10.7 — two objectives measured over the Chapter 5 events. The OBJECTIVES (15 minutes, 95%) are
// illustrative choices; the MEASUREMENTS are real local computations: 8 of the 11 events pass the rules,
// and against a fixed clock of 10:20 the newest event (09:50) is 30 minutes old.
export const objectivesAlerts: Scene = {
  id: 'objectives-alerts',
  title: 'Objectives you can measure and alert on',
  flow: 'TB',
  nodes: [
    {
      id: 'objective-table',
      kind: 'table',
      label: 'Two objectives, measured',
      sub: 'objectives illustrative; data is Chapter 5\'s',
      headers: ['Objective', 'Target', 'Measured', 'Status'],
      values: [
        ['freshness', 'newest event under 15 min', '30 min', 'breached'],
        ['data quality', 'at least 95% pass rules', '8 of 11 = 72.7%', 'breached'],
      ],
    },
    {
      id: 'freshness-query',
      kind: 'code',
      filename: 'freshness.sql  (local, fixed clock)',
      label: `SELECT timestampdiff(MINUTE,
  max(event_ts),
  TIMESTAMP '2026-10-01 10:20:00') AS lag
FROM typed_events;   -- 30`,
    },
    {
      id: 'alert-design',
      kind: 'list',
      label: 'Alert on the objective',
      items: [
        'one alert per objective, not per error',
        'say who is paged and what to check',
        'a breach starts a diagnosis, not a rerun',
      ],
      framed: true,
    },
  ],
  edges: [
    { source: 'objective-table', target: 'freshness-query' },
    { source: 'freshness-query', target: 'alert-design' },
  ],
}
