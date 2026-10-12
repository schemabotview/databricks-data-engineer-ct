import type { Course } from '../types'
import { recomputeVsIncremental } from './01-recompute-vs-incremental'
import { eventTimeWatermarks } from './02-event-time-watermarks'
import { statefulAggregationDedup } from './03-stateful-aggregation-dedup'
import { streamingJoins } from './04-streaming-joins'
import { checkpointsRestartsChanges } from './05-checkpoints-restarts-changes'
import { sinksForeachbatchIdempotency } from './06-sinks-foreachbatch-idempotency'
import { sourceCdcSequenceDeletes } from './07-source-cdc-sequence-deletes'
import { scdType1Vs2 } from './08-scd-type-1-vs-2'
import { cdfVsSourceCdc } from './09-cdf-vs-source-cdc'
import { workedRecovery } from './10-worked-recovery'

// Chapter 6 of docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md — one section per numbered item, in plan order.
// Objective: Explain incremental correctness under time, ordering, mutation, and recovery constraints.
// Outcome: Trace changing data through state and tables, explain late/duplicate/delete handling, and
//   identify the assumptions needed for a safe restart or replay.
// Worked illustrations (plan): event and state timelines; annotated streaming reads/writes; CDC
//   update/delete records; SCD1 and SCD2 result tables; a restart trace. The CDF example is a CONFIGURED
//   feed (delta.enableChangeDataFeed = true); an eligible automatic feed was not tested.
// Bridge: The change-processing rules are explicit; next we express them through managed declarative
//   pipeline abstractions. (Also the last words of the final narration.)
// STATUS: every output is from a LOCAL run (PySpark 4.0.1 + Delta 4.0.0), asserted by
//   scripts/verify/ch06_streaming_cdc.py. AUTO CDC (declarative pipelines) is Chapter 7, documented, not run.
export const streamingCdc: Course = {
  id: 'streaming-cdc',
  title: 'Streaming, CDC, and Changing State',
  sections: [
    recomputeVsIncremental,
    eventTimeWatermarks,
    statefulAggregationDedup,
    streamingJoins,
    checkpointsRestartsChanges,
    sinksForeachbatchIdempotency,
    sourceCdcSequenceDeletes,
    scdType1Vs2,
    cdfVsSourceCdc,
    workedRecovery,
  ],
}
