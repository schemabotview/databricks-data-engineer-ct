import type { Scene } from '@graphlearning/flow'
import { recomputeVsIncremental } from './recompute-vs-incremental'
import { watermarkTimeline } from './watermark-timeline'
import { stateGrowth } from './state-growth'
import { streamJoins } from './stream-joins'
import { restartChanges } from './restart-changes'
import { replaySinks } from './replay-sinks'
import { cdcFeed } from './cdc-feed'
import { scdTypes } from './scd-types'
import { cdfVsCdc } from './cdf-vs-cdc'
import { recoveryGuards } from './recovery-guards'

// One bundle per course folder, spread into src/scenes/index.ts.
export const streamingCdcScenes: Scene[] = [
  recomputeVsIncremental,
  watermarkTimeline,
  stateGrowth,
  streamJoins,
  restartChanges,
  replaySinks,
  cdcFeed,
  scdTypes,
  cdfVsCdc,
  recoveryGuards,
]
