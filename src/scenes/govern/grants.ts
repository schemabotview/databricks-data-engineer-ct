import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { projectTree } from '../project'
import { START_FILES } from '../lakehouse'
import code from '../../../spine/govern/04-grants/project/governance/grants.sql?raw'
import session from '../../../spine/govern/04-grants/session.txt?raw'

// grants.sql is DOCUMENTED (GRANT syntax and inheritance, via search summaries); the matrix is a real
// run of tools/grant_matrix.py — a MODEL of the documented rules, not Unity Catalog.
export const grants: Scene = ideFrame(
  'grants',
  'retail-lakehouse',
  projectTree([...START_FILES, '~data/external/', 'tools/drop_demo.py', 'governance/grants.sql', 'tools/grant_matrix.py'], 'governance/grants.sql', ['governance', 'tools/grant_matrix.py'], ['conf', 'notebooks']),
  { file: 'governance/grants.sql', title: 'governance/grants.sql — documented, not run', code, highlight: [5, 6, 9, 10, 11, 14, 15, 16], terminal: session },
  {
    id: 'grants-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'principals',
        kind: 'table',
        label: 'Three principals',
        headers: ['principal', 'is'],
        values: [
          ['finance', 'a group of people'],
          ['data-engineers', 'a group of people'],
          ['retail-job', 'a service principal'],
        ],
      },
      {
        id: 'grant-rules',
        kind: 'list',
        icon: 'key',
        label: 'Least privilege, by the rules',
        pattern: 'network',
        items: [
          'Reading needs all three: catalog, schema, SELECT',
          'A grant on a schema covers its tables',
          'Grant to groups, not to people',
          'The terminal is a model of the rules, not UC',
        ],
      },
    ],
  },
)
