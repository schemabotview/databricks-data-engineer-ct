import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { quietIvy } from './ivy'
import { startTree } from './tree'
import code from '../../../spine/start/04-first-table/project/tools/load_sample.py?raw'
import raw from '../../../spine/start/04-first-table/session.txt?raw'

// The eight-order sample of CLAUDE.md, written for real; the folder listing and the log's actions are
// that run's. Two part files because local[2] wrote two partitions — file counts are never quoted.
export const firstTable: Scene = ideFrame(
  'first-table',
  'retail-lakehouse',
  startTree(4, 'tools/load_sample.py', ['tools/load_sample.py']),
  { file: 'tools/load_sample.py', code, highlight: [13, 15, 16], terminal: quietIvy(raw) },
  {
    id: 'first-table-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'on-disk',
        kind: 'table',
        label: 'bronze.orders, on disk',
        headers: ['file', 'what it is'],
        values: [
          ['part-0000N-….parquet', 'the rows, in Parquet'],
          ['_delta_log/…000.json', 'version 0: the commit'],
          ['…000.crc', 'a checksum of that version'],
          ['_staged_commits/', 'empty here'],
          ['metastore_db/', 'the name bronze.orders'],
        ],
      },
      {
        id: 'first-table-facts',
        kind: 'list',
        icon: 'layers',
        label: 'The log is the table',
        pattern: 'storage',
        items: [
          'commitInfo, metaData, protocol, then one add per file',
          'A reader trusts the log, not a folder listing',
          'Two files because two tasks wrote them',
          'Course 5 reads every version of this log',
        ],
      },
    ],
  },
)
