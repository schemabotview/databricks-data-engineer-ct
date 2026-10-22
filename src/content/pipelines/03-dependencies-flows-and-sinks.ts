import type { Section } from '../types'

export const dependenciesFlowsAndSinks: Section = {
  id: 'dependencies-flows-and-sinks',
  title: 'Dependencies, flows and sinks',
  scene: 'pipeline-graph',
  narration:
    "Nothing in the pipeline file draws an arrow, yet the pipeline knows the order to run things in. This frame shows the graph our three definitions produce. Bronze orders reads the landing volume with cloud files. Silver orders reads bronze orders as a stream, by name. Gold sales reads silver orders, and joins the stores reference. Each of those reads is an edge. The stores table is read by its full three-part name from outside the pipeline, so it is a source, not a node the pipeline manages. Underneath on the left is the second project file this course adds: the bundle resource that deploys the pipeline, documented and not run. It names the pipeline, the catalog and schema its datasets are published to, serverless compute, and continuous false, which means a triggered pipeline: each update processes what is there and stops. Its library is the pipelines file. Course twelve deploys it with the rest of the bundle. The table on the right gives the four words the documentation uses. A dataset is a table or view the pipeline owns. A flow is what writes into a dataset; usually it is implied by the definition, but one streaming table can take several flows, such as two sources appended into one table. A sink is a flow whose target is outside the pipeline, such as a message bus. And an update is one run of the whole graph. The list adds the rule that makes this safe: a cycle is refused before anything runs. Next, the quality rules, declared as expectations.",
}
