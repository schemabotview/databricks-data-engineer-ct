import type { Course } from '../types'
import { controlAndComputePlanes } from './01-control-and-compute-planes'
import { accountsWorkspacesMetastores } from './02-accounts-workspaces-metastores'
import { computeChoices } from './03-compute-choices'
import { theDatabricksRuntime } from './04-the-databricks-runtime'
import { aQuerysPath } from './05-a-querys-path'
import { whereCodeIsWritten } from './06-where-code-is-written'

export const howDatabricksRuns: Course = {
  id: 'how-databricks-runs',
  title: 'How the platform runs your code',
  sections: [controlAndComputePlanes, accountsWorkspacesMetastores, computeChoices, theDatabricksRuntime, aQuerysPath, whereCodeIsWritten],
}
