import type { Course } from '../types'
import { imperativeAndDeclarative } from './01-imperative-and-declarative'
import { streamingTablesMaterializedViewsAndViews } from './02-streaming-tables-materialized-views-and-views'
import { dependenciesFlowsAndSinks } from './03-dependencies-flows-and-sinks'
import { expectationsSection } from './04-expectations'
import { incrementalSemantics } from './05-incremental-semantics'
import { autoCdcAndScd } from './06-auto-cdc-and-scd'
import { updatesAndRefreshes } from './07-updates-and-refreshes'
import { eventLogsAndAWalkthrough } from './08-event-logs-and-a-walkthrough'

export const pipelines: Course = {
  id: 'pipelines',
  title: 'Declare the pipeline',
  sections: [imperativeAndDeclarative, streamingTablesMaterializedViewsAndViews, dependenciesFlowsAndSinks, expectationsSection, incrementalSemantics, autoCdcAndScd, updatesAndRefreshes, eventLogsAndAWalkthrough],
}
