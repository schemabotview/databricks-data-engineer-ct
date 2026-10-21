import type { Scene } from '@graphlearning/flow'
import { consumers } from './consumers'
import { layers } from './layers'
import { lakehouse } from './lakehouse'
import { medallion } from './medallion'
import { build } from './build'

export const whyDatabricksScenes: Scene[] = [consumers, layers, lakehouse, medallion, build]
