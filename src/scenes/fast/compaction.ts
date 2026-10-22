import type { Scene } from '@graphlearning/flow'
import { fastFrame } from './frame'
import code from '../../../spine/fast/05-compaction/project/tools/fast/compaction.py?raw'
import raw from '../../../spine/fast/05-compaction/session.txt?raw'

// 200 writers make 128 small files; OPTIMIZE bin-packs them into 25 (target size lowered to 400 KB in
// tools/fast/lab.py) — a real run (spine/fast/05); the rows are unchanged.
export const compaction: Scene = fastFrame('fast-small-files', 5, 'tools/fast/compaction.py', { code, highlight: [6, 7, 11], terminal: raw }, ['tools/fast/compaction.py'], {
  id: 'compaction-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'files-count',
      kind: 'table',
      label: 'The same million rows',
      headers: ['', 'files', 'opened by store 7'],
      values: [
        ['200 writers', '128', '128'],
        ['after OPTIMIZE', '25', '25'],
      ],
    },
    {
      id: 'compaction-facts',
      kind: 'list',
      icon: 'package',
      label: 'Why small files cost',
      pattern: 'service',
      items: [
        'Every file is opened, listed and read on its own',
        'Many small writes or many writers make many files',
        'OPTIMIZE rewrites them into fewer, larger ones',
        'The old files stay for time travel until VACUUM',
        'Compaction alone does not skip: §6 sorts the data',
      ],
    },
  ],
})
