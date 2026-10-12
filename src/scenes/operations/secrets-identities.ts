import type { Scene } from '@graphlearning/flow'

// §10.9 — secrets and the identities around a deployment. DOCUMENTED, NOT RUN. Production runs under a
// service principal is recommended by the bundle docs (search summaries); the secrets call and its output
// redaction, and the exact shape of an expired-credential failure, were NOT confirmed and must be
// re-verified. The failure text is ILLUSTRATIVE.
export const secretsIdentities: Scene = {
  id: 'secrets-identities',
  title: 'Secrets and the identities that deploy and run',
  flow: 'TB',
  nodes: [
    {
      id: 'identity-roles',
      kind: 'table',
      label: 'Three identities, three jobs',
      sub: 'least privilege each',
      headers: ['Identity', 'Does', 'Needs'],
      values: [
        ['CI service principal', 'deploys the bundle', 'manage the job, no data'],
        ['run-as principal', 'runs the job', 'read and write its tables'],
        ['a person', 'reviews and approves', 'view, not production data'],
      ],
    },
    {
      id: 'secret-code',
      kind: 'code',
      filename: 'secret.py  (documented, not run)',
      label: `token = dbutils.secrets.get(
  scope="retail", key="source-token")
# the value is not in code, Git or logs`,
    },
    {
      id: 'expired-trace',
      kind: 'code',
      filename: 'a failed deploy  (illustrative)',
      label: `databricks bundle deploy -t prod
Error: authentication failed
  (credential expired or revoked)`,
    },
  ],
  edges: [
    { source: 'identity-roles', target: 'secret-code' },
    { source: 'secret-code', target: 'expired-trace' },
  ],
}
