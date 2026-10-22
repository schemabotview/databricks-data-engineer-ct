import type { Section } from '../types'

export const computeSizingServerlessAndPhoton: Section = {
  id: 'compute-sizing-serverless-and-photon',
  title: 'Compute sizing, serverless and Photon',
  scene: 'fast-compute',
  narration:
    "The most obvious way to make something faster is a bigger machine, and the most expensive. This frame is documented, not run, and it is about eligibility, not recipes. The three cards are the levers the documentation describes. Classic compute: you choose the node type, the number of workers or autoscaling, and you pay while it sits idle until it times out. Serverless: the platform chooses and starts the compute, you pay for what runs, and some settings are fixed for you, with availability varying by region and feature. And Photon: a native engine underneath Spark that runs the same SQL and DataFrame code, speeds up the operators it supports, and falls back to Spark for the rest. Whether a particular workload benefits was not confirmed here, so check the query plan rather than assume. The table is the reason to measure first. Each row is a symptom from the last section. One task thirteen times the median is skew, and a bigger machine does not help, because that one task still does the work. Two hundred tasks for a thousand rows is too many partitions, and more machines only add overhead. Every file opened is a missing layout, and more machines help only a little, at a price. A sort spilling to disk, from too little memory, is the case where bigger machines really do help. The list sums it up. Serverless removes the sizing decision, not a bad data layout. Photon changes the engine, not the shape of the plan. Next, joins, shuffles and skew.",
}
