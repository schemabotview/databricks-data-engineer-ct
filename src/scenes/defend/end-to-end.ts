import type { Scene, SceneNode } from '@graphlearning/flow'

// The whole design, component by component, with the course whose run (R) or documentation (D)
// stands behind each guarantee. A summary of earlier results; nothing new is run here.
const part = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon, pattern })

export const endToEnd: Scene = {
  id: 'defend-end-to-end',
  framed: true,
  padding: 0.03,
  flow: 'LR',
  align: 'start',
  nodes: [
    {
      id: 'chain',
      label: 'retail-lakehouse, end to end',
      pattern: 'network',
      icon: 'workflow',
      children: [
        part('sources', 'Sources', 'order files, order CDC, stores', 'file', 'external'),
        part('bronze', 'bronze', 'as it arrived, once', 'database', 'storage'),
        part('silver', 'silver', 'typed, checked, latest', 'funnel', 'storage'),
        part('gold', 'gold', 'a contract per city', 'sigma', 'storage'),
        part('readers', 'Readers', 'through grants', 'usercheck', 'user'),
      ],
      edges: [
        { source: 'sources', target: 'bronze' },
        { source: 'bronze', target: 'silver' },
        { source: 'silver', target: 'gold' },
        { source: 'gold', target: 'readers' },
      ],
    },
    {
      id: 'e2e-below',
      label: 'e2e-below',
      bare: true,
      align: 'start',
      children: [
        {
          id: 'guarantees',
          kind: 'table',
          label: 'Which component guarantees what, and the evidence',
          headers: ['guarantee', 'given by', 'evidence'],
          values: [
            ['the source is understood', 'source contracts', 'Course 6 §1 (assumed)'],
            ['each file is read once', 'bronze checkpoint', 'Course 6 §4 (R): 3, 6, 6, 8'],
            ['no write is half-done', 'Delta transactions', 'Course 5 §2 (R)'],
            ['every event accounted for', 'quality rules, quarantine', 'Course 7 §6 (R): 11 = 6+1+1+3'],
            ['changes applied in order', 'sequence-guarded MERGE', 'Course 8 §7 (R)'],
            ['gold’s shape holds', 'NOT NULL, CHECK, comments', 'Course 7 §7 (R)'],
            ['only the right readers', 'Unity Catalog grants', 'Course 4 (D, model)'],
            ['it runs, and is watched', 'job, objectives, owners', 'Courses 10, 12 (D, M, R)'],
          ],
        },
        {
          id: 'e2e-facts',
          kind: 'list',
          icon: 'shieldcheck',
          label: 'Defending a design',
          pattern: 'service',
          items: [
            'Name each guarantee and the one component that gives it',
            'Point at evidence: a run, a model, or the documentation',
            'Say which is which: run, documented, model',
            'A guarantee with no component is a hope',
          ],
        },
      ],
    },
  ],
  edges: [],
}
