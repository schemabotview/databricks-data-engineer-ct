import type { Scene } from '@graphlearning/flow'

// Tables, views and volumes (DOCUMENTED: privilege names SELECT and READ VOLUME, the path form
// /Volumes/<catalog>/<schema>/<volume>/…, via search summaries). The local column says where each
// lives in this project instead.
export const securables: Scene = {
  id: 'tables-views-volumes',
  framed: true,
  padding: 0.04,
  nodes: [
    {
      id: 'kinds',
      kind: 'table',
      label: 'Three securables a schema holds (documented, not run)',
      headers: ['object', 'holds', 'reached by', 'locally'],
      values: [
        ['table', 'rows with a schema', 'its three-part name', 'bronze.orders'],
        ['view', 'a saved query, no data', 'its three-part name', 'a temp view'],
        ['volume', 'any files, any format', '/Volumes/cat/schema/vol/…', 'data/landing/'],
      ],
    },
    {
      id: 'ways',
      label: 'The same landing data, two ways in',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'tabular',
          kind: 'code',
          filename: 'tabular.sql — documented',
          label: ['-- rows, through a table', 'SELECT status, count(*)', 'FROM retail.bronze.orders', 'GROUP BY status;'].join('\n'),
        },
        {
          id: 'files',
          kind: 'code',
          filename: 'files.py — documented',
          label: ['# files, through a volume', 'spark.read.csv(', '  "/Volumes/retail/bronze/landing/orders/",', '  header=True)'].join('\n'),
        },
      ],
    },
    {
      id: 'granting',
      label: 'Granting',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'privs',
          kind: 'table',
          label: 'Each is granted on its own',
          headers: ['on', 'to read', 'to write'],
          values: [
            ['a table', 'SELECT', 'MODIFY'],
            ['a view', 'SELECT', '—'],
            ['a volume', 'READ VOLUME', 'WRITE VOLUME'],
            ['a schema', 'USE SCHEMA', 'CREATE TABLE, CREATE VOLUME'],
          ],
        },
        {
          id: 'when',
          kind: 'list',
          icon: 'search',
          label: 'Which one, when',
          pattern: 'user',
          items: [
            'Files arrive as files: land them in a volume',
            'Everything from bronze on is a table',
            'A view shares a question, not a copy',
            'Reading gold need not mean reading raw files',
          ],
        },
      ],
    },
  ],
  edges: [],
}
