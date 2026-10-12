import type { Section } from '../types'

export const dataEngineeringRequirements: Section = {
  id: 'data-engineering-requirements',
  title: 'Data engineering requirements: consumers, freshness, correctness, and cost',
  scene: 'requirements-matrix',
  focus: 'consumers-table',
  slide: `## Start from the consumer, not the tool

**Objective:** state what a data product must deliver before choosing any platform feature.

**Model:** every design is judged on four things its consumers can feel: **who** reads it, how **fresh** it is, how **correct** it is, and what it **costs** to produce.

### Worked: three readers of one order feed
- **Finance close** needs totals by 06:00, right to the cent
- **Store dashboard** may be about 15 minutes old, but counts must match
- **Analyst history** can wait a day, yet must contain no duplicate orders

These numbers are assumptions chosen to show the trade-offs, not measurements.

### The trade, and the trap
- Fresher means more frequent runs, so more cost
- Stricter means more checks, so more time
- **Trap:** "fresher is always better". A 15-minute refresh of a total that finance reads once a day buys nothing.`,
  narration:
    "Before choosing any Databricks feature, a data engineer asks what the finished data has to do for the people who use it. Every design is judged on four things those people can feel. Who reads it, how fresh it is, how correct it is, and what it costs to produce. Take one stream of retail orders and three readers. The finance team closes the books and needs daily totals by six in the morning, right to the cent. A store dashboard can show numbers about fifteen minutes old, but the counts must match what the stores see. An analyst studying history can wait until the next day, but the data must not contain the same order twice. I should be clear that these figures are assumptions I picked to show the trade-offs. They are not measurements from a real company. Now notice that the three readers pull in different directions. Fresher data means running more often, and running more often costs more. Stricter correctness means more checks, and checks take time. So one pipeline rarely suits all three equally, and the first engineering decision is deciding whose need sets the design. The common trap is believing that fresher is always better. If finance only reads a total once a day, refreshing it every fifteen minutes spends money and buys nothing. Keep these four questions, because every later chapter returns to them. Next we look at where Spark, Delta and Databricks each fit in meeting them.",
}
