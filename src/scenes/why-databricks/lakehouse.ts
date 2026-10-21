import type { Scene, SceneNode } from '@graphlearning/flow'

// The two-system architecture against the lakehouse. A concept frame: no product is benchmarked,
// and no claim is made that one copy is always cheaper — the table says what changes.
const box = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon, pattern })
const reader = (id: string, label: string, icon: string): SceneNode => ({ id, label, variant: 'chip', icon, pattern: 'storage' })

export const lakehouse: Scene = {
  id: 'lakehouse',
  framed: true,
  padding: 0.04,
  header: 'band',
  flow: 'LR',
  align: 'start',
  nodes: [
    {
      id: 'designs',
      label: 'Two copies, or one',
      bare: true,
      cols: 2,
      align: 'start',
      stretch: true,
      children: [
        {
          id: 'before',
          label: 'A lake and a warehouse',
          sub: 'files for engineering and ML, a database for BI',
          pattern: 'warn',
          icon: 'none',
          children: [
            box('b-files', 'Data lake', 'raw files in cloud storage; cheap, no transactions', 'harddrive', 'warn'),
            box('b-etl', 'Copy job', 'reshape and load, every night', 'copy', 'warn'),
            box('b-wh', 'Warehouse', 'a second copy, in a closed format, for SQL', 'warehouse', 'warn'),
          ],
          edges: [
            { source: 'b-files', target: 'b-etl' },
            { source: 'b-etl', target: 'b-wh' },
          ],
        },
        {
          id: 'after',
          label: 'A lakehouse',
          sub: 'one copy, open files, every workload',
          pattern: 'storage',
          icon: 'none',
          children: [
            box('a-files', 'Open table files', 'Parquet + a Delta log, in your cloud storage', 'layers', 'storage'),
            box('a-catalog', 'One catalog', 'names, grants and lineage over those files', 'shieldcheck', 'storage'),
            {
              id: 'a-readers',
              label: 'Engines on the same copy',
              bare: true,
              cols: 3,
              children: [reader('a-sql', 'SQL and BI', 'barchart'), reader('a-eng', 'Spark jobs', 'spark'), reader('a-stream', 'Streams', 'waves')],
            },
          ],
          edges: [
            { source: 'a-files', target: 'a-catalog' },
            { source: 'a-catalog', target: 'a-readers' },
          ],
        },
      ],
    },
    {
      id: 'verdict',
      label: 'What changes',
      bare: true,
      children: [
        {
          id: 'compare',
          kind: 'table',
          label: 'What changes',
          headers: ['', 'lake + warehouse', 'lakehouse'],
          values: [
            ['copies of the data', 'two, kept in step by a job', 'one'],
            ['format', 'open, then closed', 'open throughout'],
            ['transactions', 'warehouse only', 'on the files, by the log'],
            ['access rules', 'defined twice', 'one catalog'],
            ['SQL sees a write', 'after the nightly copy', 'when it commits'],
          ],
        },
        {
          id: 'caveats',
          kind: 'list',
          icon: 'scale',
          label: 'What it does not remove',
          pattern: 'warn',
          items: [
            'Modelling: raw files still need cleaning into tables',
            'Layout: file sizes and clustering still decide speed',
            'Discipline: one copy only helps if nobody makes another',
          ],
        },
      ],
    },
  ],
  edges: [],
}
