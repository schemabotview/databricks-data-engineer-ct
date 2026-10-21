import type { Scene } from '@graphlearning/flow'
import { projectTour } from './tour'
import { newProject } from './new-project'
import { sessionFrame } from './session'
import { firstTable } from './first-table'
import { firstQuery } from './first-query'
import { notebook } from './notebook'

export const startScenes: Scene[] = [projectTour, newProject, sessionFrame, firstTable, firstQuery, notebook]
