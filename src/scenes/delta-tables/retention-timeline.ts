import type { Scene } from '@graphlearning/flow'

// §3.6 — what VACUUM does to old versions. LOCAL RUN on a throwaway table `ret` (versions: 1 inserts
// 1 and 2, 2 inserts 3, 3 deletes 1). The retention check had to be switched OFF to use 0 hours; the
// default check refused. The 7-day and 30-day defaults are DOCUMENTED, not shown by the run.
export const retentionTimeline: Scene = {
  id: 'retention-timeline',
  title: 'Why a former version can become unreadable',
  flow: 'TB',
  nodes: [
    {
      id: 'readability-table',
      kind: 'table',
      label: 'Reading old versions of ret',
      sub: 'before and after VACUUM RETAIN 0 HOURS',
      headers: ['Version', 'Before', 'After'],
      values: [
        ['1 (ids 1, 2)', 'readable', 'FILE_NOT_EXIST'],
        ['2 (ids 1, 2, 3)', 'readable', 'FILE_NOT_EXIST'],
        ['3 (ids 2, 3)', 'readable', 'readable'],
        ['current', 'readable', 'readable'],
      ],
    },
    {
      id: 'vacuum-code',
      kind: 'code',
      filename: 'vacuum.sql  (demo only)',
      label: `VACUUM ret RETAIN 0 HOURS DRY RUN;
-- 2 files would be deleted

VACUUM ret RETAIN 0 HOURS;
SELECT * FROM ret VERSION AS OF 1;
-- FAILED_READ_FILE.FILE_NOT_EXIST`,
    },
    {
      id: 'retention-defaults',
      kind: 'list',
      label: 'Defaults (documented)',
      items: [
        'removed files kept 7 days',
        'commit log kept 30 days',
        'under 7 days needs the check off',
      ],
      framed: true,
    },
  ],
  edges: [
    { source: 'readability-table', target: 'vacuum-code' },
    { source: 'vacuum-code', target: 'retention-defaults' },
  ],
}
