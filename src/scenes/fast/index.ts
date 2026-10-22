import type { Scene } from '@graphlearning/flow'
import { baseline } from './baseline'
import { evidence } from './evidence'
import { compute } from './compute'
import { joins } from './joins'
import { compaction } from './compaction'
import { layouts } from './layouts'
import { predictive } from './predictive'
import { cost } from './cost'

export const fastScenes: Scene[] = [baseline, evidence, compute, joins, compaction, layouts, predictive, cost]
