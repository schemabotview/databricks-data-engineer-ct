import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { quietIvy } from './ivy'
import { startTree } from './tree'
import code from '../../../spine/start/06-notebook/project/notebooks/explore.py?raw'
import raw from '../../../spine/start/06-notebook/session.txt?raw'

// The notebook source format of Course 2 §6, run here as a plain script. The three counts are that
// run's, and are the frozen facts: 8 rows, 7 order ids, 4 valid completed orders.
export const notebook: Scene = ideFrame(
  'notebook-source',
  'retail-lakehouse',
  startTree(6, 'notebooks/explore.py', ['notebooks/explore.py']),
  { file: 'notebooks/explore.py', code, highlight: [1, 5, 7, 9, 11, 16, 17, 18], terminal: quietIvy(raw) },
  {
    id: 'notebook-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'notebook-format',
        kind: 'table',
        label: 'A notebook is a Python file',
        headers: ['line', 'on a workspace'],
        values: [
          ['# Databricks notebook source', 'open me as a notebook'],
          ['# COMMAND ----------', 'a new cell'],
          ['# MAGIC %md', 'a markdown cell'],
          ['spark = build_session()', 'spark already exists'],
        ],
      },
      {
        id: 'notebook-facts',
        kind: 'list',
        icon: 'search',
        label: '8 rows, but only 4 good sales',
        pattern: 'warn',
        items: [
          'o4 was sent twice: 8 rows, 7 orders',
          'o7’s amount is “n/a”: not a sale we can sum',
          'o3 is cancelled, o6 still pending',
          'Silver will make that explicit — Course 7',
        ],
      },
    ],
  },
)
