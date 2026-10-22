import type { Course } from '../types'
import { recomputeOrIncrement } from './01-recompute-or-increment'
import { eventTimeAndWatermarks } from './02-event-time-and-watermarks'
import { statefulAggregationAndDeduplication } from './03-stateful-aggregation-and-deduplication'
import { streamingJoins } from './04-streaming-joins'
import { checkpointsAndRestarts } from './05-checkpoints-and-restarts'
import { sinksForeachBatchAndIdempotency } from './06-sinks-foreachbatch-and-idempotency'
import { sourceCdc } from './07-source-cdc'
import { scdType1AndType2 } from './08-scd-type-1-and-type-2'
import { tableCdfAndSourceCdc } from './09-table-cdf-and-source-cdc'
import { aWorkedRecovery } from './10-a-worked-recovery'

export const changes: Course = {
  id: 'changes',
  title: 'Handle change',
  sections: [recomputeOrIncrement, eventTimeAndWatermarks, statefulAggregationAndDeduplication, streamingJoins, checkpointsAndRestarts, sinksForeachBatchAndIdempotency, sourceCdc, scdType1AndType2, tableCdfAndSourceCdc, aWorkedRecovery],
}
