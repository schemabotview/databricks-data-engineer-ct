import type { Scene } from '@graphlearning/flow'
import { modules } from './modules'
import { wheel } from './wheel'
import { tests } from './tests'
import { bundles } from './bundles'
import { promotion } from './promotion'
import { observability } from './observability'
import { objectives } from './objectives'
import { deletion } from './deletion'
import { identities } from './identities'
import { ownership } from './ownership'

export const operateScenes: Scene[] = [modules, wheel, tests, bundles, promotion, observability, objectives, deletion, identities, ownership]
