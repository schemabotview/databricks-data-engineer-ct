import type { Scene, SceneNode } from '@graphlearning/flow'

// What to ask of a source before ingesting it. A concept frame: the retail sources' answers are the
// course's own assumptions for its example (CLAUDE.md), not measurements.
const q = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern'], items: string[]): SceneNode =>
  ({ id, kind: 'list', label, sub, icon, pattern, items })

export const contracts: Scene = {
  id: 'source-contracts',
  framed: true,
  padding: 0.04,
  nodes: [
    {
      id: 'questions',
      label: 'Five questions for every source',
      bare: true,
      cols: 3,
      align: 'start',
      stretch: true,
      children: [
        q('format', 'Format', 'what is in a file', 'file', 'service', ['CSV, JSON, Parquet…', 'Header? Delimiter?', 'Dates and decimals how?']),
        q('keys', 'Keys', 'what makes a row unique', 'key', 'service', ['A business key: order_id', 'Can one arrive twice?', 'Can it change later?']),
        q('arrival', 'Arrival', 'how and when it comes', 'clock', 'network', ['Whole files, or events?', 'How often, how late?', 'In order, or not?']),
        q('retention', 'Retention', 'how long the source keeps it', 'history', 'warn', ['Can we ask again?', 'For how many days?', 'After that, bronze is the copy']),
        q('owner', 'Owner', 'who to call when it breaks', 'usercheck', 'user', ['Who changes the format?', 'Who tells us first?', 'What do they promise?']),
      ],
    },
    {
      id: 'answers',
      label: 'answers',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'retail',
          kind: 'table',
          label: 'The retail lakehouse’s three sources, answered (the course’s assumptions)',
          headers: ['source', 'format', 'key', 'arrival', 'source keeps it'],
          values: [
            ['store order files', 'CSV with a header', 'order_id', 'a file per batch, resends happen', '30 days'],
            ['order changes', 'CDC records (JSON)', 'order_id + sequence', 'continuous, can be out of order', '7 days'],
            ['stores reference', 'CSV, small', 'store_id', 'replaced when a store opens', 'only the latest'],
          ],
        },
        {
          id: 'why',
          kind: 'list',
          icon: 'search',
          label: 'Why ask before writing code',
          pattern: 'warn',
          items: [
            'A resend is only a duplicate if you know the key',
            'Late or out-of-order arrival decides batch or stream (Course 8)',
            'Once the source forgets, bronze is the only copy — keep it raw',
          ],
        },
      ],
    },
  ],
  edges: [],
}
