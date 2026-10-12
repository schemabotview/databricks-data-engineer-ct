import type { Section } from '../types'

export const smallFilesCompaction: Section = {
  id: 'small-files-compaction',
  title: 'Small files, compaction, and write/read trade-offs',
  scene: 'file-layout',
  focus: 'file-counts',
  slide: `## Many small files cost every read

**Objective:** explain how small files arise, and what compaction trades.

**Model:** each write task writes **its own files**. Many tasks, or a write split across many partitions, means many small files. Each file must be **opened and planned** by every query. \`OPTIMIZE\` rewrites them into fewer, larger files.

### Worked: the same 1,000,000 rows (local run)
- Written by 200 tasks: **128** files. After \`OPTIMIZE\`: **25**
- Partitioned by \`order_date\`: **720** files
- Partitioned by \`customer_id\`: **2,000** files
- (Target file size lowered to 400 KB so the demo is visible)

### Reading file counts
- Look at files per partition, not only partitions
- A partition column should have few, large values

### Trade-offs
- Compaction **rewrites** data: it costs compute and storage
- File counts here are for this run, so they illustrate and do not predict`,
  narration:
    "Small files are one of the most common hidden costs. Every write task writes its own files. So many tasks, or a write that is split across many partitions, produces many small files. Each query then has to open and plan every one of them. The remedy is compaction, which on Delta tables is the optimize command: it rewrites small files into fewer, larger ones. Here are the numbers from a local run, on the same one million rows. Written by two hundred tasks, the table had one hundred twenty eight files. After optimize, it had twenty five. I lowered the target file size to four hundred kilobytes so that a small demo produces several files, as a big table would. The bigger surprise is partitioning. Partitioning the same rows by order date produced seven hundred twenty files, because each of the twenty four write tasks wrote a file into each of thirty partitions. Partitioning by customer, a column with a thousand values, produced two thousand files. Partitioning an unsorted write multiplies files. So look at files per partition and not only partitions, and partition only on a column with few, large values. There are trade-offs. Compaction rewrites data, so it costs compute and storage. And these counts are for this run and this layout, so they illustrate the effect and do not predict your numbers. Next we look at layouts that let a query skip files.",
}
