import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { projectTree } from '../project'
import { START_FILES } from '../lakehouse'
import { quietIvy } from '../start/ivy'
import code from '../../../spine/govern/03-managed-external/project/tools/drop_demo.py?raw'
import raw from '../../../spine/govern/03-managed-external/session.txt?raw'

// The local half is a real run (spine/govern/03): DROP deletes a managed table's folder and leaves an
// external one's, which still reads as 8 rows. The platform half (UC managed storage, UNDROP within a
// recovery window) is DOCUMENTED, via search summaries.
export const managed: Scene = ideFrame(
  'managed-external',
  'retail-lakehouse',
  projectTree([...START_FILES, '~data/external/', 'tools/drop_demo.py'], 'tools/drop_demo.py', ['tools/drop_demo.py'], ['conf', 'notebooks']),
  { file: 'tools/drop_demo.py', code, show: [[8, 23]], highlight: [10, 11, 13, 14, 19, 20, 21], terminal: quietIvy(raw) },
  {
    id: 'managed-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'who-owns',
        kind: 'table',
        label: 'Who owns the files',
        headers: ['', 'managed', 'external'],
        values: [
          ['folder chosen by', 'the catalog', 'you'],
          ['DROP TABLE', 'files go', 'files stay'],
          ['on Databricks', 'UC storage', 'ext. location'],
          ['undo a DROP', 'UNDROP', 'not needed'],
        ],
      },
      {
        id: 'managed-facts',
        kind: 'list',
        icon: 'shieldcheck',
        label: 'Run here, documented there',
        pattern: 'service',
        items: [
          'Locally the drop deletes at once (run)',
          'On Unity Catalog, managed files are removed later (documented)',
          'External is for data another system owns',
          'Course 12 returns to deleting data on purpose',
        ],
      },
    ],
  },
)
