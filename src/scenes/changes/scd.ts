import type { Scene } from '@graphlearning/flow'
import { changesFrame } from './frame'
import code from '../../../spine/changes/08-scd/project/tools/changes/scd.py?raw'
import raw from '../../../spine/changes/08-scd/session.txt?raw'

// The same seven distinct change records kept as SCD type 1 (o1, o2 current) and type 2 (six versions,
// o3's closed by its delete) — a real run (spine/changes/08).
export const scd: Scene = changesFrame('scd-types', 8, 'tools/changes/scd.py', { code, show: [[6, 21]], highlight: [7, 12, 13, 20, 21], terminal: raw }, ['tools/changes/scd.py'], {
  id: 'scd-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'two-answers',
      kind: 'table',
      label: 'Two questions, two tables',
      headers: ['', 'answers', 'o3'],
      values: [
        ['SCD type 1', 'what is true now?', 'gone'],
        ['SCD type 2', 'what was true when?', 'open 1 → 2'],
      ],
    },
    {
      id: 'scd-facts',
      kind: 'list',
      icon: 'history',
      label: 'What history means',
      pattern: 'service',
      items: [
        'Type 1 overwrites: one row per key, the latest',
        'Type 2 adds a row per version, valid from → to',
        'A delete closes the last version; it adds none',
        'The sequence orders versions, not the arrival',
        'Type 2 must be decided before the history is lost',
      ],
    },
  ],
})
