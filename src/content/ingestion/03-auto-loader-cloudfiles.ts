import type { Section } from '../types'

export const autoLoaderCloudfiles: Section = {
  id: 'auto-loader-cloudfiles',
  title: 'Auto Loader and the cloudFiles source',
  scene: 'auto-loader',
  focus: 'autoloader-code',
  slide: `## Read only what is new

**Objective:** read an Auto Loader stream and say what each part is for.

**Model:** Auto Loader is a Structured Streaming source, \`cloudFiles\`, that discovers **new files** in cloud storage and processes each once. It adds schema tracking and keeps unexpected data. (Documented, not run.)

### Annotated
- \`format("cloudFiles")\` and \`cloudFiles.format\`: the source and the file type
- \`cloudFiles.schemaLocation\`: where the inferred schema is kept
- \`checkpointLocation\`: where progress is kept
- \`availableNow\`: process what is there, then stop
- \`toTable\`: write to a governed Delta table

### Misconception
- **"It is a different engine."** It is a Spark stream source, with the same checkpoint rules`,
  narration:
    "Auto Loader is how Databricks ingests files incrementally. It is a Structured Streaming source called cloud files. Instead of re-reading everything, it discovers the files that are new in a storage location and processes each one once. It also adds schema tracking, and it can keep data that does not fit the schema instead of dropping it. This board is documented, not run, because Auto Loader is a Databricks source and I had no workspace. So re-check the option names against the current documentation. Read the code from the top. Format cloud files names the source, and the cloud files format option says the files are CSV. The schema location option says where Auto Loader keeps the schema it has inferred. The load path is a volume path. On the write side, the checkpoint location says where progress is kept. The trigger, available now, means process everything that is there, then stop, which suits a scheduled job. And to table writes into a governed Delta table. The misconception to avoid is that this is some separate engine. It is a Spark stream source, so the same ideas about checkpoints and restarts apply, and the next section shows them in a local run. Next we see how progress is tracked.",
}
