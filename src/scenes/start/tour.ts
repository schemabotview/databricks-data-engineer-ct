import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'

// The finished project as docs/DATABRICKS-DATA-ENGINEER-COURSE-PLAN.md describes it. Nothing here runs
// yet — this frame is the map, so the editor's place holds what each part is for, not code.
export const projectTour: Scene = ideFrame(
  'project-tour',
  'retail-lakehouse',
  [
    { name: '.venv', folder: true, state: 'muted', note: 'Spark + Delta' },
    { name: 'conf', folder: true, note: 'logs, defaults' },
    { name: 'data', folder: true, note: 'landing/, reference/' },
    { name: 'governance', folder: true, note: 'grants.sql' },
    { name: 'notebooks', folder: true, note: 'explore.py' },
    { name: 'pipelines', folder: true, note: 'retail.py' },
    { name: 'resources', folder: true, note: 'job, pipeline' },
    {
      name: 'src',
      children: [
        {
          name: 'retail',
          children: [
            { name: 'session.py', state: 'active' }, { name: 'bronze.py' }, { name: 'silver.py' },
            { name: 'gold.py' }, { name: 'quality.py' }, { name: 'cdc.py' },
          ],
        },
      ],
    },
    { name: 'tests', folder: true, note: 'pytest' },
    { name: 'tools', folder: true, note: 'sample, generator' },
    { name: 'databricks.yml' },
    { name: 'pyproject.toml' },
    { name: 'requirements.txt' },
  ],
  {
    id: 'parts',
    kind: 'table',
    label: 'What each part is for, and where we build it',
    headers: ['part', 'its job', 'course'],
    values: [
      ['.venv/, requirements.txt', 'Spark and Delta, locally', '3'],
      ['src/retail/session.py', 'one way to start Spark', '3'],
      ['governance/grants.sql', 'who may read what', '4'],
      ['data/landing/', 'files as they arrive', '6'],
      ['bronze.py, silver.py, gold.py', 'the three layers', '6 → 7'],
      ['quality.py', 'rules and reconciliation', '7 → 12'],
      ['cdc.py', 'changes and history', '8'],
      ['pipelines/', 'the same, declared', '9'],
      ['resources/, databricks.yml', 'job, pipeline, bundle', '10, 12'],
      ['tools/', 'sample data, a million orders', '3, 11'],
      ['tests/', 'checks on every change', '12'],
    ],
  },
  {
    id: 'legend',
    kind: 'list',
    icon: 'folder',
    label: 'Reading every lesson',
    sub: 'the same panels, always',
    pattern: 'network',
    items: [
      'Left: the project, as your editor shows it',
      'NEW marks a file this lesson adds',
      'The highlighted file is the one in the editor',
      'Centre: the code, this lesson’s lines highlighted',
      'Below it: the terminal, exactly as it really ran',
      '··· N lines folds what this lesson does not need',
      'Platform-only files are marked documented, not run',
    ],
  },
)
