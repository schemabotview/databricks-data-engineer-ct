import type { Scene } from '@graphlearning/flow'
import { incremental } from './incremental'
import { watermarks } from './watermarks'
import { state } from './state'
import { joins } from './joins'
import { restarts } from './restarts'
import { sinks } from './sinks'
import { sourceCdc } from './source-cdc'
import { scd } from './scd'
import { cdfVsCdc } from './cdf-vs-cdc'
import { recovery } from './recovery'

export const changesScenes: Scene[] = [incremental, watermarks, state, joins, restarts, sinks, sourceCdc, scd, cdfVsCdc, recovery]
