import type { Scene } from '@graphlearning/flow'
import { planes } from './planes'
import { boundaries } from './boundaries'
import { compute } from './compute'
import { runtime } from './runtime'
import { queryPath } from './query-path'
import { codeWhere } from './code-where'

export const howDatabricksRunsScenes: Scene[] = [planes, boundaries, compute, runtime, queryPath, codeWhere]
