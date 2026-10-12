import type { Section } from '../types'

export const firstQuery: Section = {
  id: 'first-query',
  title: 'Notebooks, SQL, PySpark, and an annotated first query',
  scene: 'first-query',
  focus: 'first-result',
  slide: `## Reading a first query

**Objective:** read one question in SQL and in PySpark, and say where it ran and what it read.

**Model:** a notebook cell sends code to compute. The compute reads the table from storage, does the work, and returns a small result.

### Worked: orders per status
- \`FROM bronze_orders\` and \`spark.table("bronze_orders")\` name the same Delta table
- \`GROUP BY status\` and \`groupBy("status")\` ask for one count per status
- Spark splits the files into tasks, counts in parallel, then combines the partial counts

### The trap
- **COMPLETED is 6 rows, not 6 orders.** The table holds o4 twice and o7 with amount \`n/a\`
- Distinct valid completed orders: **o1, o2, o4, o5, so 4**
- Cleaning that up is the next section`,
  narration:
    "Here is the first real query, and the point is to read it, not to memorise it. A Databricks notebook cell sends code to compute. The compute reads a table from storage, does the work, and sends back a small result, which the notebook displays. In a Databricks notebook a Spark session called spark is already defined for you. Our table is bronze orders, with eight rows from the retail example. The question is simple: how many orders are there per status? On the left is the SQL. From bronze orders, group by status, count the rows, and sort by status. On the right is the same question in PySpark. Read the table, group by status, aggregate a count, and order by status. Both describe the same intent, and Spark plans them to the same kind of work. Underneath, Spark splits the table's files into tasks, counts in parallel, then combines the partial counts. Both return the same three rows from my local run: cancelled one, completed six, pending one. Now stop on that six, because it is the trap. Completed is six rows, not six orders. The table contains order four twice, because it was resent, and order seven, whose amount is the text n slash a. The distinct valid completed orders are one, two, four and five, which is four. A query can be perfectly correct and still answer the wrong question, if the data underneath is not ready. Fixing that is the job of the next section, where we layer the data.",
}
