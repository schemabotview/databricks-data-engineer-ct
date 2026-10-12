import type { Scene } from '@graphlearning/flow'

// §2.4 — grants, the permission matrix they produce, and a denied-access trace. DOCUMENTED, NOT
// EXECUTED. The matrix follows from the GRANT statements under the documented inheritance rules and
// is checked by scripts/verify/ch02_governance_model.py (a model, not Unity Catalog). The error text
// is the SHAPE of a denial, paraphrased; exact wording varies by runtime.
export const leastPrivilege: Scene = {
  id: 'least-privilege',
  title: 'Grants, the matrix they make, and a denial',
  flow: 'TB',
  nodes: [
    {
      id: 'grant-code',
      kind: 'code',
      filename: 'grants.sql  (excerpt, documented, not run)',
      label: `GRANT USE CATALOG ON CATALOG retail
  TO \`analysts\`;
GRANT USE SCHEMA, SELECT ON SCHEMA retail.gold
  TO \`analysts\`;
GRANT ALL PRIVILEGES ON SCHEMA retail.silver
  TO \`data_engineers\`;`,
    },
    {
      id: 'who-can',
      kind: 'table',
      label: 'Who can do what',
      sub: 'analysts, engineers, the ETL service principal',
      headers: ['Principal', 'bronze', 'silver', 'gold'],
      values: [
        ['analysts', 'no', 'no', 'read'],
        ['data_engineers', 'read/write', 'read/write', 'no'],
        ['etl_runner', 'read', 'read/write', 'no'],
      ],
    },
    {
      id: 'denied-trace',
      kind: 'code',
      filename: 'as analysts  (illustrative)',
      label: `SELECT * FROM retail.silver.orders;
-- INSUFFICIENT_PERMISSIONS: no USE SCHEMA
--   on retail.silver, no SELECT on the table`,
    },
  ],
  edges: [
    { source: 'grant-code', target: 'who-can' },
    { source: 'who-can', target: 'denied-trace' },
  ],
}
