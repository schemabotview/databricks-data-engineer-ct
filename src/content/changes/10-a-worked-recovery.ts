import type { Section } from '../types'

export const aWorkedRecovery: Section = {
  id: 'a-worked-recovery',
  title: 'A worked recovery',
  scene: 'worked-recovery',
  narration:
    "The last section brings the course together on one bad day. The sequenced table from the last section has its change feed, but its files are vacuumed with zero hours of retention, the way a too-eager cleanup job might. The terminal shows vacuum deleting the old files. Then the change feed from version one is read again, and fails: the file does not exist. The history is gone. The table itself still reads, and the next line shows it intact: order one completed at sequence three, order two completed at sequence two, order three deleted. So the current state survived, but every question about the past now has no answer. The last part rebuilds the table from the source's raw change records, all eight at once, duplicates and late ones included, through the same apply function. The rebuilt table equals the original. That works for one reason only: the raw records were still there. The table on the right is what was left after the vacuum. The list collects the course's three defences. Duplicates need an idempotent sink. Out-of-order changes need a sequence guard. And lost history needs the raw records, kept in bronze, because a rebuild is only ever possible from what was kept. That is why retention is a recovery decision, not only a storage cost. Next course, the same pipeline declared instead of written: Lakeflow declarative pipelines.",
}
