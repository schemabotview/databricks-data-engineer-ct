import type { Section } from '../types'

export const recomputeOrIncrement: Section = {
  id: 'recompute-or-increment',
  title: 'Recompute or increment',
  scene: 'recompute-or-increment',
  narration:
    "Until now, every run read every file. That is simple and always correct, but its cost grows with history, not with what is new. This course is about handling change, and it starts with the cheapest change: new rows arriving. The sample here is ten order events in four small JSON files, which land one at a time, the way a store would send them. The tool does two things after each file lands. The highlighted read is a recompute: it reads every file so far and counts the rows. The stream below it is incremental: the same files, read as a stream with a checkpoint, so each run reads only what arrived since the last one. The terminal shows the difference. After the first file both read three rows. After the second, the recompute reads six and the stream three. After all four, the recompute has read twenty-seven rows in total, and the stream ten, exactly the ten events. The list says what that saving rests on. The source must only append: a file, once landed, never changes. The checkpoint remembers what was already read, which is the stream's only memory. And recompute work grows with history, while incremental work grows with arrivals. A change to a row that was already read is not an arrival, so a plain incremental read never sees it. That is source CDC, later in this course. Next, what happens when events arrive late.",
}
