import type { Section } from '../types'

export const expectationsSection: Section = {
  id: 'expectations',
  title: 'Expectations',
  scene: 'expectations',
  narration:
    "In course seven, the quality rules lived in the quality module, and silver's build sent failing rows to a quarantine table. In a pipeline the same rules are expectations, and each expectation has a policy for what happens when a row fails it. There are three. Warn keeps the row and records the violation. Drop removes the row and records it. Fail stops the update. This frame cannot run a pipeline, so the tool in the editor is a model: plain Spark applying the project's own rules to the eleven bronze events, by the documented semantics of each policy. It proves nothing about the platform, and the frame says so. The terminal shows the rules one by one: the unreadable amount fails one row, order seven; the negative amount fails one, order eight; the unknown store fails one, order nine; and no status is invalid. Then the policies. Warn keeps all eleven and records three violations. Drop keeps eight and drops three. Fail stops at the first violation and writes nothing. The table on the right gives each policy's decorator, what it keeps, and whether the pipeline reports metrics for it. According to the documentation, warn and drop produce counts; fail produces the stop. The list says what the model shows that matters. Drop loses the row, and keeps no table like our silver quarantine. When a dropped row matters, keep a quarantine table as well, by declaring a second dataset with the opposite condition. And fail is for the rules that must never be broken. Next, what a streaming table assumes about its source.",
}
