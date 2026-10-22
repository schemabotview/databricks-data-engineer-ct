import type { Scene } from '@graphlearning/flow'
import { versions } from './versions'
import { conflict } from './conflict'
import { contract } from './contract'
import { changes } from './changes'
import { history } from './history'
import { vacuum } from './vacuum'
import { changeFeed } from './change-feed'
import { features } from './features'

export const tablesScenes: Scene[] = [versions, conflict, contract, changes, history, vacuum, changeFeed, features]
