import type { Course } from '../types'
import { theFinishedProject } from './01-the-finished-project'
import { aNewProject } from './02-a-new-project'
import { aSessionThatSpeaksDelta } from './03-a-session-that-speaks-delta'
import { theFirstTable } from './04-the-first-table'
import { theFirstQuery } from './05-the-first-query'
import { notebookSource } from './06-notebook-source'

export const start: Course = {
  id: 'start',
  title: 'Start the project',
  sections: [theFinishedProject, aNewProject, aSessionThatSpeaksDelta, theFirstTable, theFirstQuery, notebookSource],
}
