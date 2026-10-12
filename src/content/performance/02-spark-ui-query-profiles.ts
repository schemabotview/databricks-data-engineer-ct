import type { Section } from '../types'

export const sparkUiQueryProfiles: Section = {
  id: 'spark-ui-query-profiles',
  title: 'Spark UI and SQL query profiles: locating expensive work',
  scene: 'stage-metrics',
  focus: 'task-quantiles',
  slide: `## Find the stage, then the task

**Objective:** read per-task numbers and say whether work is evenly spread.

**Model:** a job splits into **stages**, each into **tasks**. The Spark UI, and its REST API, report per-task metrics. A healthy stage has similar tasks; a **skewed** one has a few tasks doing most of the work.

### Worked: 80% of orders in one store (local run)
- A 4-task shuffle stage read **36,115**, **43,880**, **64,525** and **855,480** records
- Median **64,525**, maximum **855,480**: one task did about **13x** the median
- The stage ends when its **slowest task** ends

### Reading the evidence
- Skew: the maximum sits far above the median
- Even work: the quantiles are close together

### On Databricks
- The SQL **query profile** shows per-operator rows and time (documented, not run)`,
  narration:
    "Before you change anything, find where the work goes. A job is split into stages, and each stage into tasks. The Spark UI shows metrics for each of them, and the same numbers are available from its monitoring REST API. A healthy stage has tasks of similar size. A skewed stage has a few tasks doing most of the work, and the stage only ends when its slowest task ends. Here is a real excerpt from a local run. I made eighty percent of the orders belong to one store, then asked Spark to repartition by store, so that a shuffle stage with four tasks reads the data. The REST task summary reports how many records each task read, at five quantiles. The minimum is thirty six thousand, the lower quartile forty three thousand, the median sixty four thousand five hundred, and the upper quartile and maximum are both eight hundred fifty five thousand four hundred eighty. So one task read about thirteen times the median. That is the signature of skew, and it tells you where to look before you change anything. Read the quantiles: a maximum far above the median is skew, close together means even work, and rows and bytes are more repeatable evidence than time. On Databricks, the SQL query profile gives a similar per operator view, with rows and time, but I did not run it, so it is documented only. The habit is to read the evidence first and guess second. Next we look at sizing the compute itself.",
}
