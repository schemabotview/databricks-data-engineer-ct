import type { Scene } from '@graphlearning/flow'

// §7.4 — what each expectation policy keeps, over the 11 Chapter 5 bronze events. The SQL is DOCUMENTED,
// NOT RUN. The counts are LOCAL ARITHMETIC of the documented policies (scripts/verify/ch07_pipelines_local.py),
// not output from a pipeline engine: a NULL amount is not "> 0", so o7 fails two rules.
export const expectationPolicies: Scene = {
  id: 'expectation-policies',
  title: 'Warn, drop or fail',
  flow: 'TB',
  nodes: [
    {
      id: 'expect-code',
      kind: 'code',
      filename: 'silver.sql  (documented, not run)',
      label: `CREATE OR REFRESH STREAMING TABLE silver_orders (
  CONSTRAINT amount_present
    EXPECT (amount IS NOT NULL)
    ON VIOLATION DROP ROW,
  CONSTRAINT amount_positive
    EXPECT (amount > 0) ON VIOLATION FAIL UPDATE
) AS SELECT ...;`,
    },
    {
      id: 'policy-results',
      label: 'The same 11 rows, three policies',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'policy-table',
          kind: 'table',
          label: 'Policy outcomes',
          sub: 'local arithmetic',
          headers: ['Policy', 'Kept', 'Dropped'],
          values: [
            ['warn', '11', '0'],
            ['drop', '8', '3'],
            ['fail', '0', 'update stops'],
          ],
        },
        {
          id: 'pass-fail-table',
          kind: 'table',
          label: 'Pass / fail per rule',
          sub: 'what warn would record',
          headers: ['Rule', 'Pass', 'Fail'],
          values: [
            ['amount_present', '10', '1'],
            ['amount_positive', '9', '2'],
            ['store_known', '10', '1'],
          ],
        },
      ],
    },
  ],
  edges: [{ source: 'expect-code', target: 'policy-results' }],
}
