import type { Scene } from '@graphlearning/flow'

// §4.2 — a batch load and what repeating it does. The COPY INTO statement is DOCUMENTED, NOT RUN
// (Databricks SQL). The plain batch append is a LOCAL RUN: loading the same eight rows twice leaves 16.
export const batchLoad: Scene = {
  id: 'batch-load',
  title: 'Batch loads and repeat-load assumptions',
  flow: 'TB',
  nodes: [
    {
      id: 'copy-into-code',
      kind: 'code',
      filename: 'copy_into.sql  (documented, not run)',
      label: `COPY INTO retail.bronze.orders
FROM '/Volumes/retail/bronze/landing/'
FILEFORMAT = CSV
FORMAT_OPTIONS ('header' = 'true');`,
    },
    {
      id: 'repeat-table',
      kind: 'table',
      label: 'A plain batch append, run twice',
      sub: 'local run, same 8 rows',
      headers: ['Run', 'Rows in bronze'],
      values: [
        ['first load', '8'],
        ['same load again', '16'],
      ],
    },
    {
      id: 'repeat-assumptions',
      kind: 'list',
      label: 'Repeat-load assumptions',
      items: [
        'COPY INTO skips files it loaded (documented)',
        'a plain append skips nothing',
        'COPY INTO scope: the files named',
      ],
      framed: true,
    },
  ],
  edges: [
    { source: 'copy-into-code', target: 'repeat-table' },
    { source: 'repeat-table', target: 'repeat-assumptions' },
  ],
}
