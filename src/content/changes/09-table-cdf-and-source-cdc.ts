import type { Section } from '../types'

export const tableCdfAndSourceCdc: Section = {
  id: 'table-cdf-and-source-cdc',
  title: 'Table CDF and source CDC',
  scene: 'cdf-vs-cdc',
  narration:
    "Course five turned on Delta's change data feed, and this course has used a source's change records. They sound alike, but they describe different things, and this frame puts them side by side. The tool creates the sequenced table with the change feed on, applies the source's three batches through the project's apply function, and then reads the table's feed back. The source sent eight records. The table's feed holds nine rows, grouped in the terminal by version and change type. Version one has three inserts. Version two has three pre-images and three post-images, one pair per changed row. Order three's delete is one of them, because in our table a delete is an update of its flag. And batch three, with the late update and the repeated insert, changed nothing in our table, so the feed has no rows for it. That is the point of the table on the right. Source CDC says what the source did, including the changes we chose to ignore. The table's feed says what our table did, only what the merge actually changed. The list says which to read. To build silver from a source, read the source's records. To build gold incrementally from silver, read silver's feed, because it already holds only real changes. Next, a worked recovery, where the history is gone.",
}
