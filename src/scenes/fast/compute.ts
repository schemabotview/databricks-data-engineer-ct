import type { Scene, SceneNode } from '@graphlearning/flow'

// Compute sizing, serverless and Photon — DOCUMENTED, as eligibility rather than recipes (via search
// summaries; Photon eligibility for this workload was NOT confirmed, so it stays generic). No prices.
const c = (id: string, label: string, sub: string, icon: string, items: string[]): SceneNode =>
  ({ id, kind: 'list', label, sub, icon, pattern: 'network', items })

export const compute: Scene = {
  id: 'fast-compute',
  framed: true,
  padding: 0.03,
  align: 'start',
  nodes: [
    {
      id: 'levers',
      label: 'levers',
      bare: true,
      cols: 3,
      align: 'start',
      stretch: true,
      children: [
        c('size', 'Classic compute', 'you choose the machines', 'cpu', ['Node type: memory against cores', 'Number of workers, or autoscaling', 'Idle until it times out: you pay for it', 'Pinned runtime version']),
        c('serverless', 'Serverless', 'the platform chooses', 'cloud', ['Starts without you sizing it', 'Billed for what runs, not for idle', 'Fewer settings: some configs are fixed', 'Region and feature availability vary']),
        c('photon', 'Photon', 'a native engine under Spark', 'zap', ['Same SQL and DataFrame code', 'Speeds up the operators it supports', 'Falls back to Spark for the rest', 'Eligibility: check the plan, do not assume']),
      ],
    },
    {
      id: 'compute-below',
      label: 'compute-below',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'first',
          kind: 'table',
          label: 'What to fix before buying bigger machines',
          headers: ['symptom (§2)', 'cause', 'bigger machines help?'],
          values: [
            ['one task 13× the median', 'skew (§4)', 'no: one task still does it'],
            ['200 tasks, 1,000 rows', 'too many partitions', 'no: more overhead'],
            ['every file opened', 'no layout (§6)', 'a little, at a cost'],
            ['a sort spilling to disk', 'too little memory', 'yes'],
          ],
        },
        {
          id: 'compute-facts',
          kind: 'list',
          icon: 'scale',
          label: 'Eligibility, not recipes',
          pattern: 'warn',
          items: [
            'Measure first: compute is the most expensive fix',
            'Serverless removes sizing, not data layout',
            'Photon changes the engine, not the plan’s shape',
            'This course runs none of them: documented only',
          ],
        },
      ],
    },
  ],
  edges: [],
}
