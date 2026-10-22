import type { Scene } from '@graphlearning/flow'

// Secrets and identities — DOCUMENTED (secret scopes and dbutils.secrets.get; service principals with
// OAuth; redaction of secret values in notebook output is UNVERIFIED wording). Illustrative only.
const CODE = [
  '# documented, not run: secrets live in a scope, never in code',
  'password = dbutils.secrets.get(scope="retail", key="partner-api")',
  '',
  '# never this: it ends up in git, in logs, in every copy',
  'password = "s3cr3t"',
].join('\n')

export const identities: Scene = {
  id: 'operate-identities',
  framed: true,
  padding: 0.03,
  align: 'start',
  nodes: [
    {
      id: 'who',
      kind: 'table',
      label: 'Three identities, least privilege (illustrative)',
      headers: ['identity', 'kind', 'may', 'may not'],
      values: [
        ['ana', 'person', 'develop in dev, read prod gold', 'write prod tables'],
        ['ci-deployer', 'service principal', 'deploy the bundle to staging, prod', 'read customer data'],
        ['retail-job', 'service principal', 'read bronze, write silver and gold', 'deploy, or grant'],
      ],
    },
    {
      id: 'id-below',
      label: 'id-below',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        { id: 'secret-code', kind: 'code', filename: 'a secret, read at run time — documented', label: CODE, highlight: [2] },
        {
          id: 'id-facts',
          kind: 'list',
          icon: 'key',
          label: 'Identities, not people, run production',
          pattern: 'warn',
          items: [
            'Each identity gets only what its job needs',
            'A secret is read at run time from a scope',
            'Rotate it in one place; nothing is redeployed',
            'Output redaction of secrets: re-check the docs',
            'Course 10 §6: the grants that job still lacks',
          ],
        },
      ],
    },
  ],
  edges: [],
}
