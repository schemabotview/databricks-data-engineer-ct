import type { Scene } from '@graphlearning/flow'

// §5.1 — laziness, an action, and the shuffle that a GROUP BY needs. LOCAL RUN (shuffle partitions = 2,
// AQE off so the plan shows the Exchange). Plan text is trimmed: expression ids, plan ids and the scan's
// output list are removed; operator names and order are verbatim.
export const sparkPlanModel: Scene = {
  id: 'spark-plan-model',
  title: 'Lazy plans, actions and one shuffle',
  flow: 'TB',
  nodes: [
    {
      id: 'lazy-code',
      kind: 'code',
      filename: 'status_counts.py',
      label: `by_status = (spark.table("bronze_events")
  .groupBy("status")
  .agg(F.count("*").alias("orders")))
# nothing has run yet: no job

by_status.collect()
# an action: Spark now runs a job`,
    },
    {
      id: 'plan-card',
      kind: 'code',
      filename: 'explain()  (trimmed, local run)',
      label: `HashAggregate(keys=[status],
  functions=[count(1)])
+- Exchange hashpartitioning(status, 2)
   +- HashAggregate(keys=[status],
        functions=[partial_count(1)])
      +- Scan bronze_events`,
    },
    {
      id: 'status-result',
      kind: 'table',
      label: 'The action returns',
      sub: '11 event rows',
      headers: ['status', 'orders'],
      values: [
        ['CANCELLED', '1'],
        ['COMPLETED', '8'],
        ['PENDING', '2'],
      ],
    },
  ],
  edges: [
    { source: 'lazy-code', target: 'plan-card' },
    { source: 'plan-card', target: 'status-result' },
  ],
}
