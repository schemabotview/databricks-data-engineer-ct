import type { Scene } from '@graphlearning/flow'
import { endToEnd } from './end-to-end'
import { requirements } from './requirements'
import { platforms } from './platforms'
import { critique } from './critique'
import { decisions } from './decisions'

export const defendScenes: Scene[] = [endToEnd, requirements, platforms, critique, decisions]
