import type { Scene } from '@graphlearning/flow'
import { lazy } from './lazy'
import { samePlan } from './same-plan'
import { types } from './types'
import { join } from './join'
import { latest } from './latest'
import { quality } from './quality'
import { gold } from './gold'
import { run } from './run'

export const transformScenes: Scene[] = [lazy, samePlan, types, join, latest, quality, gold, run]
