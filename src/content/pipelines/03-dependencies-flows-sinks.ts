import type { Section } from '../types'

export const dependenciesFlowsSinks: Section = {
  id: 'dependencies-flows-sinks',
  title: 'Dataset dependencies, flows, and supported sinks',
  scene: 'pipeline-graph',
  focus: 'node-silver',
  slide: `## The graph is the reads

**Objective:** draw a pipeline's dependency graph from its definitions.

**Model:** a **flow** is a query that feeds a target dataset. The pipeline derives its dependencies from what each dataset **reads**, then runs flows in that order. You never write task dependencies.

### Worked: the retail graph (documented, not run)
- landing volume, then \`bronze_orders\`, then \`typed_orders\`
- then \`silver_orders\`, then \`gold_sales\`
- \`FROM STREAM(bronze_orders)\` makes a streaming dependency
- \`FROM silver_orders\` makes a batch one

### Why derive, not declare
- Adding a dataset is adding a query, not editing a schedule

### Sinks
- Tables are the default target of a flow
- Other sinks exist as a separate feature: check availability first`,
  narration:
    "In a pipeline you never write down which step must run before which. The dependencies come from what each dataset reads. A flow is a query that feeds a target dataset, and the pipeline looks at what each flow reads, builds a graph, and runs the flows in dependency order. Here is the graph for the retail example. The landing volume feeds bronze orders. Bronze orders feeds the typed orders view. The view feeds silver orders. And silver orders feeds the gold sales materialized view. The way you create each edge is simply by naming what you read. Reading from stream of bronze orders makes a streaming dependency. Reading from silver orders makes a dependency on its stored result. If the graph has a cycle, or a name is missing, the pipeline tells you before it runs anything. By default the target of a flow is a table inside the pipeline. Pipelines also document other kinds of sinks, for example for writing out to other systems, but that is a separate feature. I did not run it, so check its availability and limits before designing around it. The practical benefit is that adding a dataset is adding a query. You do not edit a schedule. Next we put quality rules on those datasets.",
}
