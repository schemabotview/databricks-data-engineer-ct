import type { Scene } from '@graphlearning/flow'
import { fastFrame } from './frame'
import code from '../../../spine/fast/04-joins/project/tools/fast/joins.py?raw'
import raw from '../../../spine/fast/04-joins/session.txt?raw'

// Broadcast against sort-merge, then one hot store and salting — a real run (spine/fast/04):
// BroadcastHashJoin with 1 shuffle, SortMergeJoin with 3, same answer; largest partition 319,925 even,
// 855,480 skewed, 299,626 salted 64 ways.
export const joins: Scene = fastFrame('fast-joins-skew', 4, 'tools/fast/joins.py', { code, show: [[21, 26], [32, 34], [37, 40]], highlight: [21, 24, 33, 38, 39, 40], terminal: raw }, ['tools/fast/joins.py'], {
  id: 'joins-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'movement',
      kind: 'table',
      label: 'Same answer, different data movement',
      headers: ['', 'largest of 4 partitions'],
      values: [
        ['stores spread evenly', '319,925'],
        ['80% on store 7', '855,480'],
        ['store 7 salted 64 ways', '299,626'],
      ],
    },
    {
      id: 'joins-facts',
      kind: 'list',
      icon: 'link',
      label: 'Joins, shuffles and skew',
      pattern: 'service',
      items: [
        'A small side is broadcast: the big side never moves',
        'Without it, both sides shuffle: 3 exchanges, not 1',
        'A hot key puts most rows in one partition',
        'A salt splits the hot key, then the parts are summed',
        'AQE can split skewed joins itself: it was off here',
      ],
    },
  ],
})
