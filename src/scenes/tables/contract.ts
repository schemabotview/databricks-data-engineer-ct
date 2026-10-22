import type { Scene } from '@graphlearning/flow'
import { labFrame } from './frame'
import code from '../../../spine/tables/03-contract/project/tools/delta/contract.py?raw'
import raw from '../../../spine/tables/03-contract/session.txt?raw'

// Four writes refused and one deliberate evolution, from a real run (spine/tables/03, volatile: the
// refusal carries a table id and Spark's job ids).
export const contract: Scene = labFrame('schema-contract', 3, code, raw, { show: [[15, 22], [24, 30]], highlight: [15, 16, 17, 18, 22, 24, 28, 29, 30] }, {
  id: 'contract-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'refusals',
      kind: 'table',
      label: 'Four writes, four refusals',
      headers: ['write', 'stopped by'],
      values: [
        ['an extra column', 'the schema'],
        ['store_id “abc”', 'the type'],
        ['no order_id', 'NOT NULL'],
        ['amount −5.00', 'CHECK positive_amount'],
      ],
    },
    {
      id: 'contract-facts',
      kind: 'list',
      icon: 'shieldcheck',
      label: 'Enforcement, then evolution',
      pattern: 'service',
      items: [
        'A refused write leaves the table untouched',
        'New columns only when the writer asks: mergeSchema',
        'Old rows read the new column as NULL',
        'The contract lives in the table, not in each job',
      ],
    },
  ],
})
