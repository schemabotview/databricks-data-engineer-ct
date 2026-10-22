import type { Section } from '../types'

export const theOrchestratedFlow: Section = {
  id: 'the-orchestrated-flow',
  title: 'The orchestrated flow',
  scene: 'job-orchestrated',
  narration:
    "The last frame puts the course together. The model runs a job whose tasks are the project's own modules: ingest calls bronze ingest, transform builds silver, validate checks that every event is accounted for, and publish builds gold. Validate is new. It reads the counts, and fails the run if silver and quarantine hold more rows than bronze has events, so that a broken run can never reach gold. The tool runs the job on two days. On the first day, all four tasks succeed, validate counts eleven events, six in silver and three bad, and gold totals one hundred and seventy, the number from course seven. On the second day, no new files have landed. All four tasks run and succeed again, and nothing changes: still eleven events, still one hundred and seventy. The table on the right explains why a second run is harmless. Ingest is repeat-safe because of the checkpoint from course six: it reads only files it has not seen. Transform rebuilds silver whole. Validate only reads. And publish replaces gold with insert overwrite. Compare that with the last section, where an append ingest doubled bronze on a rerun. The list draws the line between the two halves of the work. The job decides when tasks run and in what order. Each task decides what it writes, and how safely. Validate stands between the data and its readers. The real job is the YAML file from the first section, and course twelve deploys it with the bundle. Next course, making it fast and cheap.",
}
