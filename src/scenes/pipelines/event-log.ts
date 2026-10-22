import type { Scene } from '@graphlearning/flow'

// Reading a failed update — DOCUMENTED (the event_log() table-valued function; event types
// flow_progress / update_progress; expectation metrics under details) via search summaries; the
// event-log schema is UNVERIFIED. The result rows are ILLUSTRATIVE: what a fail expectation on this
// project's bronze would report, built from the local model's numbers (§4), not from a platform.
const SQL = [
  '-- documented, not run: the event log of one table\'s pipeline',
  'SELECT timestamp, event_type, message',
  'FROM event_log(TABLE(retail.silver.silver_orders))',
  "WHERE event_type IN ('update_progress', 'flow_progress')",
  'ORDER BY timestamp;',
].join('\n')

export const eventLog: Scene = {
  id: 'pipeline-event-log',
  framed: true,
  padding: 0.03,
  align: 'start',
  nodes: [
    {
      id: 'log-top',
      label: 'log-top',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        { id: 'log-sql', kind: 'code', filename: 'the event log — documented, not run', label: SQL, highlight: [3, 4] },
        {
          id: 'log-rows',
          kind: 'table',
          label: 'A failed update, illustrative (not a platform run)',
          headers: ['event_type', 'message'],
          values: [
            ['update_progress', 'Update is RUNNING'],
            ['flow_progress', 'bronze_orders is COMPLETED: 11 rows'],
            ['flow_progress', 'silver_orders is FAILED'],
            ['update_progress', 'Update is FAILED'],
          ],
        },
      ],
    },
    {
      id: 'log-below',
      label: 'log-below',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'walkthrough',
          kind: 'table',
          label: 'Walking it back to a cause',
          headers: ['question', 'where the answer is'],
          values: [
            ['which update?', 'update_progress, by time'],
            ['which dataset?', 'the flow_progress that FAILED'],
            ['which rule?', 'the failure’s details: amount_positive'],
            ['which row?', 'bronze: o8, amount -5.00 (Course 7)'],
            ['what was written?', 'nothing for silver: it was a fail rule'],
          ],
        },
        {
          id: 'log-facts',
          kind: 'list',
          icon: 'search',
          label: 'What the log is for',
          pattern: 'service',
          items: [
            'Every update, flow and expectation leaves an event',
            'Warn and drop leave counts; fail leaves the stop',
            'It is a table: query it, alert on it',
            'The schema here is unverified: re-check before use',
          ],
        },
      ],
    },
  ],
  edges: [],
}
