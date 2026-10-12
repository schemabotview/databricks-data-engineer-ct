import type { Section } from '../types'

export const lakehouseConcepts: Section = {
  id: 'lakehouse-concepts',
  title: 'Lakehouse concepts and the relationship between Spark, Delta, and Databricks',
  scene: 'lakehouse-stack',
  focus: 'delta-layer',
  slide: `## Three names, three jobs

**Objective:** say what each of Spark, Delta and Databricks is responsible for.

**Model:** a **lakehouse** keeps one copy of data in open files in cloud storage and serves both SQL analysis and data-engineering code from it. **Spark** computes. **Delta** makes files behave like a table. **Databricks** runs and governs it all.

### Worked: one table on disk (local run)
- \`bronze_orders\` is **2 Parquet files** plus \`_delta_log/00000000000000000000.json\`
- The log's \`add\` lines name those two files, and the commit is **version 0**
- A reader trusts the log, not the folder listing

### Misconceptions
- **"Spark stores the data."** Spark is an engine; the files sit in storage
- **"Delta is a database server."** It is a table format: files plus a log
- File counts depend on how the data was split, so another run may write a different number`,
  narration:
    "Three names appear in almost every Databricks conversation, and it helps to give each one exactly one job. A lakehouse is the idea that ties them together. You keep a single copy of your data in open file formats in cloud storage, and you use that same copy for SQL analysis and for data engineering code. Apache Spark is the engine that does the computing. It splits work across machines and returns results. Delta Lake is what makes a folder of files behave like a table, by adding a transaction log beside the data files. Databricks is the platform that runs Spark and Delta for you, and adds security, governance, scheduling and the workspace you log in to. To see what Delta really is, look at the order table from our example, created in a local run of Spark four and Delta four. On disk it is two Parquet data files and a folder called delta log containing one JSON file, numbered all zeros. Inside that file the actions appear in order: a commit record, the table's metadata, the protocol versions, and two add lines naming the two data files. That commit is version zero of the table. A reader asks the log which files make up the table, and does not trust a folder listing. That is why Delta can offer reliable changes later. Two misconceptions are worth clearing now. Spark does not store your data, it only computes over files that live in storage. And Delta is not a database server, it is a table format made of files and a log. One caution: the number of data files depends on how the data was split when written, so another run could produce a different count. Next we place these pieces inside accounts, workspaces and storage.",
}
