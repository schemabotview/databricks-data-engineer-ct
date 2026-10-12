import type { Scene } from '@graphlearning/flow'

// §10.4 — the example's databricks.yml, abridged, and the bundle commands. DOCUMENTED, NOT VALIDATED:
// `databricks bundle validate` needs a workspace to authenticate against. Names follow the Declarative
// Automation Bundles docs as checked through search summaries (older name: Databricks Asset Bundles).
export const bundleConfig: Scene = {
  id: 'bundle-config',
  title: 'A bundle declares what to deploy and where',
  flow: 'TB',
  nodes: [
    {
      id: 'bundle-yaml',
      kind: 'code',
      filename: 'databricks.yml  (documented, not validated)',
      label: `bundle:
  name: retail_etl

include:
  - resources/*.yml

targets:
  dev:
    mode: development
  prod:
    mode: production
    run_as:
      service_principal_name: retail-etl-prod-sp`,
    },
    {
      id: 'bundle-commands',
      kind: 'table',
      label: 'Bundle commands',
      sub: 'documented, not run',
      headers: ['Command', 'Does'],
      values: [
        ['bundle validate -t prod', 'checks the configuration'],
        ['bundle deploy -t prod', 'creates or updates resources'],
        ['bundle run retail_daily', 'starts the job'],
      ],
    },
  ],
  edges: [{ source: 'bundle-yaml', target: 'bundle-commands' }],
}
