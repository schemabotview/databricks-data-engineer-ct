import type { Scene } from '@graphlearning/flow'

// §9.6 — files opened by `WHERE store_id = 7` under each layout, and by a filter on a column the layout was
// NOT built for. LOCAL RUN, read from the scan's numFiles metric. Compaction alone, Z-ordering, liquid
// clustering and partitioning are different tools; the table is evidence, not a recipe.
export const skippingLayouts: Scene = {
  id: 'skipping-layouts',
  title: 'Which layout helps which filter',
  flow: 'TB',
  nodes: [
    {
      id: 'files-read-table',
      kind: 'table',
      label: 'Files opened',
      sub: 'local run, 1,000,000 rows',
      headers: ['Layout', 'store_id = 7', 'customer_id = 5'],
      values: [
        ['unclustered', '24 of 24', '-'],
        ['compaction only', '2 of 2', '-'],
        ['Z-order by store_id', '1 of 19', '19 of 19'],
        ['liquid by store_id', '1 of 19', '19 of 19'],
        ['partition by date', '720 of 720', '-'],
      ],
    },
    {
      id: 'key-rationale',
      kind: 'list',
      label: 'Choosing a clustering key',
      items: [
        'the columns filters use most',
        'enough distinct values to split on',
        'how often the pattern changes',
        'what a rewrite costs to apply',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'files-read-table', target: 'key-rationale' }],
}
