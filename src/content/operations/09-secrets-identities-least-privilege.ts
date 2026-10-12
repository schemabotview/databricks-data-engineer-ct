import type { Section } from '../types'

export const secretsIdentitiesLeastPrivilege: Section = {
  id: 'secrets-identities-least-privilege',
  title: 'Secrets, service principals, least privilege, and deployment/run identities',
  scene: 'secrets-identities',
  focus: 'identity-roles',
  slide: `## Keep credentials out of code, and identities small

**Objective:** separate the identity that deploys from the one that runs, and keep both minimal.

**Model:** a **secret** is read at run time from a secret store, never written in code or Git. A **service principal** is an identity for automation. Give each identity only what its job needs.

### Worked: three identities (documented, not run)
- **CI service principal**: deploys the bundle, can manage the job, **no data access**
- **Run-as principal**: runs the job, reads and writes **its own tables**
- **A person**: reviews and approves, with **view** access

### Failure shape
- An expired or revoked credential fails the deploy, not the data
- Rotate on a schedule; alert before expiry`,
  narration:
    "Production needs credentials, and handling them badly is one of the easiest ways to cause an incident. A secret should be read at run time from a secret store, and never written in code, in git, or in a log. In a notebook or job you read it with a call to get a secret from a scope and a key. The documentation says its value is redacted in output, but I could not run it, so verify that. Then there are identities. A service principal is an identity for automation. And it helps to separate three roles. The service principal that runs your continuous integration deploys the bundle. It needs to manage the job, and it needs no access to the data at all. The run as principal runs the job. It needs to read and write the tables the job uses, as the run as example in chapter eight showed, and nothing more. And a person reviews and approves changes, with view access, rather than using production credentials for day to day work. Each has the least it needs. The trace on the board is illustrative, not a real error message. It shows the shape of a failure when a credential has expired or been revoked: the deploy fails with an authentication error, and the data is untouched. So rotate credentials on a schedule, and alert before they expire. Next we put owners on all of this.",
}
