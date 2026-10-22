import type { Scene } from '@graphlearning/flow'
import { transformFrame } from './frame'
import code from '../../../spine/transform/07-gold/project/src/retail/gold.py?raw'
import raw from '../../../spine/transform/07-gold/session.txt?raw'

// gold.sales as a contract — comments, NOT NULL, a CHECK, INSERT OVERWRITE that keeps them — and a
// refused write, from a real run (spine/transform/07, volatile: Spark's job ids).
export const gold: Scene = transformFrame('gold-contract', 7, 'src/retail/gold.py', { code, show: [[5, 9], [13, 23]], highlight: [5, 6, 7, 8, 9, 17, 19, 20, 21], terminal: raw }, ['src/retail/gold.py', 'tools/transform/gold_contract.py'], {
  id: 'gold-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'contract',
      kind: 'table',
      label: 'What the readers are promised',
      headers: ['promise', 'enforced by'],
      values: [
        ['one row per city', 'GROUP BY city'],
        ['only COMPLETED', 'the WHERE'],
        ['never negative', 'CHECK sales >= 0'],
        ['what each column means', 'COMMENT'],
      ],
    },
    {
      id: 'gold-facts',
      kind: 'list',
      icon: 'sigma',
      label: 'A product, not a query',
      pattern: 'storage',
      items: [
        'Readers depend on its shape: change it with care',
        'The grain is written down, not implied',
        'A broken promise fails the write, not the report',
      ],
    },
  ],
})
