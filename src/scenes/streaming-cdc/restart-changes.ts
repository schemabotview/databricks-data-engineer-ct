import type { Scene } from '@graphlearning/flow'

// §6.5 — what a restart does, and which query changes the checkpoint accepts. LOCAL RUN. The window-size
// change was ACCEPTED without any error: the checkpoint checks the state's schema, not whether the old
// state still means what the new query assumes.
export const restartChanges: Scene = {
  id: 'restart-changes',
  title: 'Restarting with the same checkpoint',
  flow: 'TB',
  nodes: [
    {
      id: 'restart-trace',
      kind: 'table',
      label: 'Restart and change results',
      sub: 'same checkpoint each time',
      headers: ['Run', 'Result'],
      values: [
        ['same query, 2 new files', 'resumes at batch 3'],
        ['add a stateless filter', 'accepted'],
        ['10-minute to 5-minute window', 'accepted, no error'],
        ['add store_id as a key', 'refused'],
      ],
    },
    {
      id: 'refusal-code',
      kind: 'code',
      filename: 'refusal  (trimmed)',
      label: `[STATE_STORE_KEY_SCHEMA_NOT_COMPATIBLE]
Provided key schema does not match
existing state key schema.`,
    },
    {
      id: 'checkpoint-holds',
      kind: 'list',
      label: 'What the checkpoint holds',
      items: ['offsets: where to resume', 'state: what is remembered', 'the query identity'],
      framed: true,
    },
  ],
  edges: [
    { source: 'restart-trace', target: 'refusal-code' },
    { source: 'refusal-code', target: 'checkpoint-holds' },
  ],
}
