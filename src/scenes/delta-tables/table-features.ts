import type { Scene } from '@graphlearning/flow'

// §3.8 — protocol versions and table features read from DESCRIBE DETAIL in a LOCAL run (Delta 4.0.0).
// Every table also lists appendOnly and invariants. Which features exist, and which runtimes can read
// them, differs between open-source Delta and Databricks: platform behaviour is DOCUMENTED, not run.
export const tableFeatures: Scene = {
  id: 'table-features',
  title: 'Protocol versions and table features',
  flow: 'TB',
  nodes: [
    {
      id: 'protocol-table',
      kind: 'table',
      label: 'DESCRIBE DETAIL, three tables',
      sub: 'local run; all also list appendOnly, invariants',
      headers: ['Table', 'Reader', 'Writer', 'Adds feature'],
      values: [
        ['plain', '1', '2', '-'],
        ['orders_c (CHECK)', '1', '3', 'checkConstraints'],
        ['feed (CDF)', '1', '7', 'changeDataFeed'],
      ],
    },
    {
      id: 'compat-list',
      kind: 'list',
      label: 'Compatibility questions',
      items: [
        'which clients must read it?',
        'does this feature raise the protocol?',
        'does the runtime support it?',
        'can another engine still read it?',
      ],
      framed: true,
    },
  ],
  edges: [{ source: 'protocol-table', target: 'compat-list' }],
}
