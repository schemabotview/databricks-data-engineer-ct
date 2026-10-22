import type { Section } from '../types'

export const smallFilesAndCompaction: Section = {
  id: 'small-files-and-compaction',
  title: 'Small files and compaction',
  scene: 'fast-small-files',
  narration:
    "A table's files are a cost of their own. Each one has to be listed, opened and read separately, so a table of many small files is slow even when it holds little data. The tool writes the same million orders with two hundred writers. To make a million rows behave like a much larger table, the fast lab module lowers optimize's target file size to four hundred kilobytes; that is the only setting changed. The terminal shows the result: one hundred and twenty-eight files, and a query for store seven opens every one of them. Then optimize, Delta's compaction command, rewrites them into fewer, larger files. Afterwards there are twenty-five files, the query opens twenty-five, and the table still holds exactly one million rows. The table on the right puts the two side by side. The list explains where small files come from and what compaction does not do. Many small writes, like a stream committing every few seconds, or many writers, like our two hundred, make many files. Optimize rewrites them into fewer. The old files stay in the table's storage for time travel until vacuum removes them, as course five showed. And notice that the store seven query still opens all twenty-five. Compaction makes fewer files, but every file still holds rows of every store, so none can be skipped. Skipping needs the data arranged by the column you filter on, which is the next section.",
}
