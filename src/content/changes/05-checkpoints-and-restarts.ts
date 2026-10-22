import type { Section } from '../types'

export const checkpointsAndRestarts: Section = {
  id: 'checkpoints-and-restarts',
  title: 'Checkpoints and restarts',
  scene: 'checkpoints-restarts',
  narration:
    "A stream stops: a deploy, a crash, a cluster restarted overnight. What it does next depends entirely on its checkpoint. The tool runs a windowed sum over the first two files, stops, lands a third file while it is stopped, and starts the same query on the same checkpoint. The terminal shows it ran batches zero to two, and after the restart, batches three and four. It did not start again from zero, and it read the file that landed while it was down, once. The listing below shows what the checkpoint holds, and the table explains each folder. Offsets record what each batch was going to read, before it runs. Commits record which batches finished. Sources record which files were read. State holds the open windows, split by partition. And metadata holds the query's identity. The last part of the tool changes the query and keeps the checkpoint, adding the store as a second grouping key. The run is refused: the state store's key schema is not compatible with the one on disk. The state was built for windows alone, and cannot be reinterpreted as windows per store. The list sums up which changes a restart survives. Stopping and starting, yes. Files landed meanwhile, yes. Many changes to filters or new columns are fine. A change to what the state is keyed by is not. That needs a new checkpoint, and a backfill to rebuild the state from the source. Next, what happens when a crash lands between writing a batch and committing it.",
}
