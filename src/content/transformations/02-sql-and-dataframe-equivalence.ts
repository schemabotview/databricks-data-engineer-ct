import type { Section } from '../types'

export const sqlAndDataframeEquivalence: Section = {
  id: 'sql-and-dataframe-equivalence',
  title: 'Equivalent SQL and DataFrame expressions and their shared query intent',
  scene: 'sql-df-equivalence',
  focus: 'plan-same',
  slide: `## One intent, two spellings

**Objective:** read a query in SQL or PySpark and know it is the same request.

**Model:** SQL text and DataFrame calls are both parsed into the same kind of plan. Spark optimises that plan, so the spelling you choose is a style decision, not a performance one.

### Worked: completed rows per store (local run)
- SQL: \`WHERE\`, \`GROUP BY\`, \`ORDER BY\`
- PySpark: \`filter\`, \`groupBy\`, \`orderBy\`
- Both return store 7: **3**, store 9: **3**, store 12: **1**, store 15: **1**
- The counts add up: 3 + 3 + 1 + 1 = **8**, the COMPLETED rows from section 1
- The physical plans are identical once expression ids are ignored

### Choosing
- SQL reads well for set logic; DataFrames for programmatic steps
- Moving a step between them should not change results
- Test equivalence by comparing results, not by reading syntax`,
  narration:
    "On Databricks you will see the same transformation written in SQL and in PySpark, and it helps to know they are two spellings of one request. Both are parsed into the same kind of plan, and Spark optimises that plan before running it. So the choice between them is mostly about readability. Here is one question, asked both ways in a local run. How many completed event rows are there per store? In SQL we write where status equals completed, group by store id, and order by store id. In PySpark we write filter, group by, aggregate a count, and order by. Both return the same four rows: store seven has three, store nine has three, store twelve has one, and store fifteen has one. The four counts add up to eight, the completed rows from section one, which is a useful cross check. I also compared the two physical plans, and apart from the internal expression ids, which differ between any two queries, they are identical. That equivalence matters in review: compare either spelling to the intent, and moving a step from SQL to PySpark should not change the results. So how should you choose? SQL reads well for set logic, such as joins and aggregation. DataFrames suit steps you build programmatically, such as a list of columns or a loop. Pick one per step and keep the intent visible, and do not assume one is faster. Next we look at the assumptions inside the data itself: types, nulls, time zones and nesting.",
}
