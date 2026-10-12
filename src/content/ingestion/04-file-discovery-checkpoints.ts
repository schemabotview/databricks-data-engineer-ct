import type { Section } from '../types'

export const fileDiscoveryCheckpoints: Section = {
  id: 'file-discovery-checkpoints',
  title: 'File discovery, progress tracking, checkpoint ownership, and identity',
  scene: 'file-progress',
  focus: 'arrival-timeline',
  slide: `## The checkpoint is the memory

**Objective:** trace what a restart reads, and say who owns the checkpoint.

**Model:** a stream's **checkpoint** records which input was planned and finished. Delete it and the query forgets everything it read.

### Worked: five runs (local run, Spark file source)
- Run 1: file a, **3** rows. Run 2: file b, **+3**, total 6
- Run 3: nothing new, **+0**. Run 4: file c, **+2**, total **8**
- Run 5, checkpoint deleted: all files read again, total **16**

### Why a restart is safe
- Offsets are written **before** a batch runs and committed **after**
- A crash between the two re-runs that batch

### Ownership
- One checkpoint belongs to **one query writing one sink**. Do not share, move or delete it
- In declarative pipelines the platform manages this state (documented)`,
  narration:
    "Incremental ingestion works because something remembers what has already been read. For a stream, that memory is the checkpoint. Let me show it with Spark's own file stream source in a local run. This is the closest analogue I could run, and Auto Loader's internals are documented, not run. Run one starts with file a, three rows, and bronze has three. Run two finds file b, adds three, and bronze has six. Run three is a restart with nothing new, and it adds nothing. That is the point of the checkpoint: restarting does not re-read. Run four finds file c and adds two, for a total of eight. Now run five, where I deleted the checkpoint and ran again. The query had no memory, so it read all three files again and appended eight more rows. Bronze now has sixteen. Looking inside the checkpoint folder, there is a metadata file holding the query's identity, an offsets folder of what each batch planned, and a commits folder of what each batch finished. Why is a restart safe? Offsets are written before a batch runs and committed after it finishes, so a crash between the two simply re-runs that batch. So who owns this? One checkpoint belongs to one query writing to one sink. Do not share it between queries, move it casually, or delete it. In declarative pipelines, which we reach in chapter seven, the platform manages this state for you, and that is documented rather than run here. Next we deal with files that change shape.",
}
