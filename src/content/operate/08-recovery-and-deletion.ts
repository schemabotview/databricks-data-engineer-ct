import type { Section } from '../types'

export const recoveryAndDeletion: Section = {
  id: 'recovery-and-deletion',
  title: 'Recovery and deletion',
  scene: 'operate-deletion',
  narration:
    "Course eight showed that keeping history makes recovery possible. This section shows the other side: when data must be deleted, every copy that makes recovery possible is a copy that still holds it. The tool creates a small table of orders with a customer column and its change feed on, three orders, two of them from customer c1. It derives a total from them, one hundred, before anything is deleted. Then c1 asks to be deleted, and the table runs a delete. The terminal looks for c1 in four places. After the delete, the table holds none of c1's rows. But version one still holds both, the change feed still holds both, and the derived total still says one hundred. A delete is a new version; the old versions keep the data. Then vacuum, with zero hours of retention for the demonstration. Now version one and the change feed are unreadable: their files are gone. But the derived total still says one hundred, because vacuum only ever cleans the table it runs on. Only recomputing it makes it thirty-five. The table on the right sums up where c1 still is at each step. The list draws the tension. Retention should be long enough to recover from a bad run, and short enough that deleted data is really gone. Every derived copy needs its own recompute. And recovery has a limit too: a backfill can only replay what the source still keeps, so if a failure is noticed five days in and the source keeps seven, there are two days left to act. Next, secrets and identities.",
}
