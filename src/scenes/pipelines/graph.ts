import type { Scene, SceneNode } from '@graphlearning/flow'
import yml from '../../../spine/pipelines/04-expectations/project/resources/retail_pipeline.yml?raw'

// The graph pipelines/retail.py's definitions produce, and the bundle resource that deploys them —
// DOCUMENTED, not run (pipeline resource fields `catalog`, `schema`, `serverless`, `continuous`,
// `libraries`; flows and sinks per the docs' summaries; re-check before publishing).
const ds = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon, pattern })

export const graph: Scene = {
  id: 'pipeline-graph',
  framed: true,
  padding: 0.03,
  align: 'start',
  nodes: [
    {
      id: 'dag',
      label: 'The graph the definitions produce',
      sub: 'no edge is written: each comes from a read',
      pattern: 'network',
      icon: 'workflow',
      flow: 'LR',
      children: [
        ds('landing', 'landing volume', 'order files, as they land', 'folder', 'external'),
        ds('bronze', 'bronze_orders', 'streaming table: new files only', 'database', 'storage'),
        ds('silver', 'silver_orders', 'streaming table + expectations', 'funnel', 'storage'),
        ds('stores', 'reference.stores', 'outside the pipeline: read by full name', 'building', 'external'),
        ds('gold', 'gold_sales', 'materialized view', 'sigma', 'storage'),
      ],
      edges: [
        { source: 'landing', target: 'bronze', label: 'cloudFiles' },
        { source: 'bronze', target: 'silver', label: 'readStream' },
        { source: 'silver', target: 'gold', label: 'read' },
        { source: 'stores', target: 'gold' },
      ],
    },
    {
      id: 'graph-below',
      label: 'graph-below',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        { id: 'resource', kind: 'code', filename: 'resources/retail_pipeline.yml — documented', label: yml },
        {
          id: 'graph-right',
          label: 'graph-right',
          bare: true,
          children: [
            {
              id: 'parts',
              kind: 'table',
              label: 'Datasets, flows and sinks (documented)',
              headers: ['part', 'is'],
              values: [
                ['dataset', 'a table or view the pipeline owns'],
                ['flow', 'what writes into a dataset'],
                ['sink', 'a flow’s target outside the pipeline'],
                ['update', 'one run of the whole graph'],
              ],
            },
            {
              id: 'graph-facts',
              kind: 'list',
              icon: 'gitbranch',
              label: 'Reading the graph',
              pattern: 'service',
              items: [
                'A dataset read by name inside the pipeline is an edge',
                'A table read by its full name is a source, not a node',
                'A cycle is refused before anything runs',
                'One streaming table can take several flows',
              ],
            },
          ],
        },
      ],
    },
  ],
  edges: [],
}
