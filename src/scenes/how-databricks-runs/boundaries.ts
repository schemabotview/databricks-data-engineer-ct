import type { Scene, SceneNode } from '@graphlearning/flow'

// Account → metastore → workspaces, DOCUMENTED (Unity Catalog setup docs, via search summaries): one
// metastore per region; workspaces in that region attach to it; identities are managed at the
// account and assigned to workspaces; a catalog can be bound to particular workspaces. The names are
// the course's (retail-co, eu-west-1, retail-dev / retail-prod), not a real account.
const ws = (id: string, label: string, sub: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon: 'layers', pattern })
const who = (id: string, label: string, icon: string): SceneNode => ({ id, label, variant: 'chip', icon, pattern: 'user' })

export const boundaries: Scene = {
  id: 'account-boundaries',
  framed: true,
  padding: 0.04,
  header: 'band',
  flow: 'LR',
  align: 'start',
  nodes: [
    {
      id: 'account',
      badge: '1',
      label: 'Account — retail-co',
      sub: 'billing, identities, workspaces, metastores (documented, not run)',
      pattern: 'network',
      icon: 'building',
      children: [
        {
          id: 'identities',
          label: 'Identities, managed once for the account',
          bare: true,
          cols: 4,
          children: [
            who('ana', 'ana — engineer', 'usercheck'),
            who('finance', 'finance — group', 'receipt'),
            who('stores', 'store-managers — group', 'building'),
            who('sp', 'retail-job — service principal', 'key'),
          ],
        },
        {
          id: 'metastore',
          badge: '2',
          label: 'Metastore — eu-west-1',
          sub: 'one per region; holds every catalog',
          pattern: 'storage',
          icon: 'database',
          cols: 2,
          children: [
            ws('dev', 'Workspace retail-dev', 'notebooks, jobs, compute for building', 'service'),
            ws('prod', 'Workspace retail-prod', 'the scheduled job and the dashboards', 'service'),
            { id: 'cat-dev', label: 'catalog retail_dev', sub: 'bound to retail-dev only', icon: 'database', pattern: 'storage' },
            { id: 'cat-prod', label: 'catalog retail', sub: 'bound to retail-prod; read-only from dev', icon: 'database', pattern: 'storage' },
          ],
        },
      ],
      edges: [{ source: 'identities', target: 'metastore', label: 'assigned to workspaces' }],
    },
    {
      id: 'side',
      label: 'Boundaries',
      bare: true,
      children: [
        {
          id: 'table',
          kind: 'table',
          label: 'Which boundary separates what',
          headers: ['boundary', 'separates', 'course'],
          values: [
            ['account', 'billing, users, regions', '2'],
            ['metastore', 'all catalogs in one region', '4'],
            ['workspace', 'notebooks, jobs, compute', '10, 12'],
            ['catalog binding', 'which workspace sees data', '4'],
            ['cloud account', 'buckets and networks', '4'],
          ],
        },
        {
          id: 'notes',
          kind: 'list',
          icon: 'search',
          label: 'Easy to get wrong',
          pattern: 'warn',
          items: [
            'A workspace is not a data boundary — the metastore is shared',
            'Grants follow the identity into every attached workspace',
            'Separate dev from prod with catalogs and bindings, not by copying',
          ],
        },
      ],
    },
  ],
  edges: [],
}
