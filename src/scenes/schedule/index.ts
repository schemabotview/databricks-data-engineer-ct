import type { Scene } from '@graphlearning/flow'
import { dag } from './dag'
import { params } from './params'
import { triggers } from './triggers'
import { failure } from './failure'
import { repair } from './repair'
import { runAs } from './run-as'
import { daily } from './daily'

export const scheduleScenes: Scene[] = [dag, params, triggers, failure, repair, runAs, daily]
