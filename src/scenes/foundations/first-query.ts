import type { Scene } from '@graphlearning/flow'

// §1.5 — one question asked in SQL and in PySpark, and the result both return. Run locally on
// PySpark 4.0.1 + Delta Lake 4.0.0 against the eight-row `bronze_orders` table; the counts are the
// real output. The point of the board is the trap: COMPLETED is 6 rows, but only 4 distinct valid
// orders, because the table holds a resent o4 and a row whose amount is 'n/a'.
export const firstQuery: Scene = {
  id: 'first-query',
  title: 'The same question in SQL and PySpark',
  flow: 'TB',
  nodes: [
    {
      id: 'two-languages',
      label: 'Same question, two languages',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'sql-version',
          kind: 'code',
          filename: 'cell.sql',
          label: `SELECT status, count(*) AS orders
FROM bronze_orders
GROUP BY status
ORDER BY status`,
        },
        {
          id: 'pyspark-version',
          kind: 'code',
          filename: 'cell.py',
          label: `from pyspark.sql import functions as F

(spark.table("bronze_orders")
  .groupBy("status")
  .agg(F.count("*").alias("orders"))
  .orderBy("status"))`,
        },
      ],
    },
    {
      id: 'what-ran',
      label: 'What ran, and what came back',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'first-result',
          kind: 'table',
          label: 'Both return',
          sub: 'bronze_orders has 8 rows',
          headers: ['status', 'orders'],
          values: [
            ['CANCELLED', '1'],
            ['COMPLETED', '6'],
            ['PENDING', '1'],
          ],
        },
        {
          id: 'execution-steps',
          kind: 'list',
          label: 'What Spark did (local run)',
          items: [
            'Read the 2 data files named by the log',
            'Counted each status inside every task',
            'Combined the partial counts',
            'Returned 3 rows to the notebook',
          ],
          framed: true,
        },
      ],
    },
  ],
  edges: [{ source: 'two-languages', target: 'what-ran' }],
}
