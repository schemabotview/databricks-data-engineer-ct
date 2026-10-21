import type { Scene } from '@graphlearning/flow'

// Where Databricks code is written and where it runs, DOCUMENTED (notebooks, workspace files, Git
// folders and Databricks Connect docs, via search summaries). The notebook is the documented SOURCE
// format a workspace exports and imports (`# Databricks notebook source`, `# COMMAND ----------`,
// `# MAGIC`); Course 3 §6 runs one like it locally.
const NOTEBOOK = [
  '# Databricks notebook source',
  '# MAGIC %md',
  '# MAGIC ## Explore the orders',
  '',
  '# COMMAND ----------',
  '',
  'orders = spark.table("retail.bronze.orders")',
  'display(orders)',
  '',
  '# COMMAND ----------',
  '',
  '# MAGIC %sql',
  '# MAGIC SELECT status, count(*) AS orders',
  '# MAGIC FROM retail.bronze.orders GROUP BY status',
].join('\n')

export const codeWhere: Scene = {
  id: 'where-code-lives',
  framed: true,
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'places',
      kind: 'table',
      label: 'Where code is written, and where it runs (documented)',
      headers: ['written in', 'runs on', 'versioned by'],
      values: [
        ['a notebook in the workspace', 'the compute it is attached to', 'notebook revisions'],
        ['a Git folder in the workspace', 'the same compute', 'Git: branch, commit, pull'],
        ['your IDE + Databricks Connect', 'remote compute, via Spark Connect', 'your Git'],
        ['your IDE, local Spark', 'your machine', 'your Git'],
        ['a bundle (Course 12)', 'jobs and pipelines it deploys', 'your Git'],
      ],
    },
    {
      id: 'below',
      label: 'The notebook, and the choice',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        { id: 'nb', kind: 'code', filename: 'notebooks/explore.py — notebook source (documented)', label: NOTEBOOK },
        {
          id: 'choice',
          kind: 'list',
          icon: 'gitbranch',
          label: 'This course’s choice',
          pattern: 'user',
          items: [
            'Code lives in files, in Git, from Course 3 on',
            'It runs locally, on open-source Spark and Delta',
            'Notebooks are for exploring; the job imports the package',
            'On a workspace the same files sit in a Git folder',
          ],
        },
      ],
    },
  ],
  edges: [],
}
