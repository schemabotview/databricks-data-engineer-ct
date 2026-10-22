import type { Scene } from '@graphlearning/flow'
import { fastFrame } from './frame'
import code from '../../../spine/fast/06-layouts/project/tools/fast/layouts.py?raw'
import raw from '../../../spine/fast/06-layouts/session.txt?raw'

// Files opened per layout and filter — a real run (spine/fast/06): no layout 24/24; compaction only
// 2/2; Z-order 1 of 19; liquid clustering 1 of 19 (customer_id: 19 on both); by order_date 720 files,
// all opened by a store filter, 24 by one date; by customer_id 2,000 files. Checksum kept everywhere.
export const layouts: Scene = fastFrame('fast-layouts', 6, 'tools/fast/layouts.py', { code, show: [[8, 15], [23, 29]], highlight: [9, 12, 13, 15, 26, 27], terminal: raw }, ['tools/fast/layouts.py'], {
  id: 'layouts-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'skipping',
      kind: 'table',
      label: 'Files opened for store_id = 7',
      headers: ['layout', 'files', 'opened'],
      values: [
        ['no layout', '24', '24'],
        ['compaction only', '2', '2'],
        ['Z-order by store', '19', '1'],
        ['liquid by store', '19', '1'],
        ['partitioned by date', '720', '720'],
      ],
    },
    {
      id: 'layouts-facts',
      kind: 'list',
      icon: 'layers',
      label: 'A layout helps the filters it was built for',
      pattern: 'service',
      items: [
        'Clustered by store: a customer filter still opens 19',
        'Partitions help only a filter on the partition column',
        'A busy column makes too many partitions: 2,000 files',
        'Liquid clustering replaces partitions and Z-order (documented)',
      ],
    },
  ],
})
