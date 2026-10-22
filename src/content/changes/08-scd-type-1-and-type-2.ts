import type { Section } from '../types'

export const scdType1AndType2: Section = {
  id: 'scd-type-1-and-type-2',
  title: 'SCD type 1 and type 2',
  scene: 'scd-types',
  narration:
    "The change records describe more than the current state. They describe a history, and a table can keep it or not. The two ways are called slowly changing dimensions, type one and type two. The tool reads the same records, drops the repeat, and leaves seven distinct changes. Type one, the first query, keeps only the current row per order: the newest record by sequence, with deleted orders removed. The terminal shows two rows, order one at forty-five, completed, and order two at twenty-five, completed. Order three is gone. Type two, the second query, keeps a row for every version, with the sequence it became valid from and the sequence it stopped being valid. Order one has three versions: pending at forty from one to two, pending at forty-five from two to three, and completed from three, still open. Order two has two. And order three has one version, valid from one to two, closed by its delete. The delete adds no row of its own. The table on the right gives the difference as two questions. Type one answers what is true now. Type two answers what was true at any time. The list adds the warning that matters most. The versions are ordered by sequence, not arrival, using the same guard as before. And type two must be chosen while the history still exists, because a type one table has already thrown it away. Next, a feed that sounds the same and answers a different question.",
}
