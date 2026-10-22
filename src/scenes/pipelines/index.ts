import type { Scene } from '@graphlearning/flow'
import { declarative } from './declarative'
import { datasetKinds } from './dataset-kinds'
import { graph } from './graph'
import { expectations } from './expectations'
import { incremental } from './incremental'
import { autoCdc } from './auto-cdc'
import { refresh } from './refresh'
import { eventLog } from './event-log'

export const pipelinesScenes: Scene[] = [declarative, datasetKinds, graph, expectations, incremental, autoCdc, refresh, eventLog]
