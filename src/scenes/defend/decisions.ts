import type { Scene } from '@graphlearning/flow'

// The decision record: a CONCEPT frame summarising the course's choices, the guarantees they rest on,
// the cost assumptions (all labelled hypothetical in Course 11) and the risks left open.
export const decisions: Scene = {
  id: 'defend-decisions',
  framed: true,
  padding: 0.03,
  align: 'start',
  nodes: [
    {
      id: 'chosen',
      kind: 'table',
      label: 'Decided, and the alternative turned down',
      headers: ['decision', 'chosen', 'instead of', 'because'],
      values: [
        ['layers', 'bronze, silver, gold', 'one cleaned table', 'raw data is the recovery copy'],
        ['latest row', 'newest landing file', 'event time', 'the files carry no event time'],
        ['bad rows', 'quarantine', 'drop', 'every event accounted for'],
        ['changes', 'sequence-guarded MERGE', 'arrival order', 'late and replayed records'],
        ['layout', 'liquid clustering by store', 'date partitions', '1 file opened, not 720'],
        ['running it', 'a job over our modules', 'a pipeline', 'tested locally first'],
      ],
    },
    {
      id: 'dec-below',
      label: 'dec-below',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'assumed',
          kind: 'list',
          icon: 'scale',
          label: 'Cost assumptions (hypothetical)',
          pattern: 'network',
          items: [
            '3 s a file, 2 machines, 1 unit a machine-hour',
            'Hourly runs: 24 a day',
            'No price quoted anywhere: re-measure on the platform',
          ],
        },
        {
          id: 'open',
          kind: 'list',
          icon: 'ban',
          label: 'Unresolved risks',
          pattern: 'warn',
          items: [
            'Silent drift: a plausible wrong amount passes',
            'retail-job still lacks two grants',
            'Every platform claim: re-check the live docs',
            'Sources keep 7 to 30 days: a slow incident loses data',
          ],
        },
      ],
    },
  ],
  edges: [],
}
