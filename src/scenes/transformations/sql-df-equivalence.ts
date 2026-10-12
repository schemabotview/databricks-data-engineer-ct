import type { Scene } from '@graphlearning/flow'

// §5.2 — one question in SQL and in the DataFrame API, with the same result and the same physical plan
// once expression ids are ignored (asserted in scripts/verify/ch05_transformations.py). LOCAL RUN.
export const sqlDfEquivalence: Scene = {
  id: 'sql-df-equivalence',
  title: 'Two spellings, one plan',
  flow: 'TB',
  nodes: [
    {
      id: 'two-spellings',
      label: 'Completed event rows per store',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'sql-spelling',
          kind: 'code',
          filename: 'query.sql',
          label: `SELECT store_id, count(*) AS n
FROM bronze_events
WHERE status = 'COMPLETED'
GROUP BY store_id
ORDER BY store_id`,
        },
        {
          id: 'df-spelling',
          kind: 'code',
          filename: 'query.py',
          label: `(spark.table("bronze_events")
  .filter("status = 'COMPLETED'")
  .groupBy("store_id")
  .agg(F.count("*").alias("n"))
  .orderBy("store_id"))`,
        },
      ],
    },
    {
      id: 'same-result',
      label: 'Same result, same plan',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'store-counts',
          kind: 'table',
          label: 'Both return',
          sub: 'local run',
          headers: ['store_id', 'n'],
          values: [
            ['7', '3'],
            ['9', '3'],
            ['12', '1'],
            ['15', '1'],
          ],
        },
        {
          id: 'plan-same',
          kind: 'list',
          label: 'Physical plan',
          items: ['same operators, same order', 'differs only in expression ids'],
          framed: true,
        },
      ],
    },
  ],
  edges: [],
}
