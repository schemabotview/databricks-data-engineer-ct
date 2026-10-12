import type { Scene } from '@graphlearning/flow'

// §9.5 — before and after file layouts. LOCAL RUN on one million orders; OPTIMIZE's target size was
// lowered to 400 KB so a small demo yields several files. Counts are exact for this run and layout-
// dependent, so they illustrate, not predict.
export const fileLayout: Scene = {
  id: 'file-layout',
  title: 'Files per table, before and after',
  flow: 'TB',
  nodes: [
    {
      id: 'file-counts',
      kind: 'table',
      label: 'Data files for the same 1,000,000 rows',
      sub: 'local run',
      headers: ['Layout', 'Files'],
      values: [
        ['written as 200 tasks', '128'],
        ['after OPTIMIZE', '25'],
        ['partitioned by order_date', '720'],
        ['partitioned by customer_id', '2,000'],
      ],
    },
    {
      id: 'file-tradeoffs',
      kind: 'list',
      label: 'Trade-offs',
      items: [
        'OPTIMIZE rewrites data: it costs compute',
        'fewer files, fewer opens per query',
        'a partition per value can mean a file per task',
        'very large files can hurt selective reads',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'file-counts', target: 'file-tradeoffs' }],
}
