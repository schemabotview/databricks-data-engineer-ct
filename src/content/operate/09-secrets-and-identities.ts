import type { Section } from '../types'

export const secretsAndIdentities: Section = {
  id: 'secrets-and-identities',
  title: 'Secrets and identities',
  scene: 'operate-identities',
  narration:
    "Production is run by identities, not by people, and each identity should be able to do exactly what its job needs and nothing more. The table at the top shows three, and it is illustrative. Ana is a person: she develops in dev and reads production gold, but cannot write production tables. CI deployer is a service principal that deploys the bundle to staging and production, and cannot read customer data. Retail job is the service principal the daily job runs as: it reads bronze and writes silver and gold, and cannot deploy anything or grant access. Underneath on the left is how code should get a secret, as documented: read it at run time from a secret scope, here a partner's API password, rather than writing it in the code, where it would end up in git, in logs, and in every copy of the repository. The list on the right adds the rest. Each identity gets only what its job needs, which is least privilege. A secret is read at run time, so rotating it changes one place and nothing is redeployed. The documentation describes secret values being redacted from notebook output, but that wording is unverified here, so check it before relying on it. And remember course ten: the model found that retail job still lacks two of the grants this table gives it. Writing the table is the decision; granting it is the work. Next, who owns the pipeline, and who pays for it.",
}
