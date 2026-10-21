import type { Scene } from '@graphlearning/flow'
import { names } from './names'
import { securables } from './securables'
import { managed } from './managed'
import { grants } from './grants'
import { storage } from './storage'
import { lineage } from './lineage'
import { sharing } from './sharing'

export const governScenes: Scene[] = [names, securables, managed, grants, storage, lineage, sharing]
