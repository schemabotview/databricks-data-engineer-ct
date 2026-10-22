import type { Section } from '../types'

export const incrementalSemantics: Section = {
  id: 'incremental-semantics',
  title: 'Incremental semantics',
  scene: 'incremental-semantics',
  narration:
    "A streaming table processes only new rows. That works because its source only appends. This frame runs, locally and for real, what happens when that assumption breaks. The tool creates a small Delta table with two pending orders and streams it into a copy. The first run copies two rows. Then the source table updates order one to completed, a row the stream has already passed on, and the stream runs again. It is refused, with Delta's error that the source table has changes it cannot ignore. Delta will not guess. An update rewrites a file the stream has already read, and the stream has no way to turn that into new rows without duplicating or losing something. The next line sets skip change commits. The stream continues, and the copy still holds two rows: the update never arrives, and order one stays pending in the copy. The last line inserts order three, and the stream reads it: three rows. Skipping skips only the commits that changed existing rows. The table on the right is the rule, and it is the same rule a streaming table in a pipeline follows: inserts are read, updates and deletes stop the stream, and skipping them goes on without them. So the list gives the choices. Skipping keeps a stream running and loses the change. When a source really changes rows, handle it as change data, in a CDC flow, which is the next section. Or read it into a materialized view, which recomputes and is right by construction. Next, AUTO CDC.",
}
