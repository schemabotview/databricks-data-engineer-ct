import type { Section } from '../types'

export const jobsPipelinesOrManagedIngestion: Section = {
  id: 'jobs-pipelines-or-managed-ingestion',
  title: 'Jobs, pipelines or managed ingestion',
  scene: 'defend-platforms',
  narration:
    "This course built the flow one way, as a job running our own modules, and showed two others along the way. The table compares the three, from the documentation and from what earlier courses ran. With a job over our code, we write the steps and their order, keep our own checkpoints, write our own quality rules and quarantine, apply changes with our own merge, and get retries and repair from Jobs. And we can test all of it locally, as the seven tests did. With a declarative pipeline, we write datasets and expectations; the pipeline keeps the streaming state, applies changes with AUTO CDC, and retries the update. The Spark inside it can be tested locally, the pipeline itself cannot. With managed ingestion, we configure a connection and its options, and the connector handles reading and retries; quality is ours afterwards. The last row is the useful one: what each leaves to you. A job leaves everything. A pipeline leaves the decisions but takes the plumbing. Managed ingestion leaves the source contract and the quality. The left list is how to choose. A supported source: try managed ingestion for bronze. A standard bronze, silver, gold flow: a pipeline. Unusual logic, or a need to test locally first: a job with code. And mixing is normal: a job can run a pipeline as one of its tasks. The right list is what no choice removes: the key, the sequence and the grain; a reconciliation readers can check; retention long enough to recover; and an owner for every table. Next, a critique of how the design fails.",
}
