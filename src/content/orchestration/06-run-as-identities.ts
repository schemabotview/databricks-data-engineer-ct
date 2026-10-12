import type { Section } from '../types'

export const runAsIdentities: Section = {
  id: 'run-as-identities',
  title: 'Run-as identities, ownership, permissions, and credential boundaries',
  scene: 'run-as-permissions',
  focus: 'run-as-table',
  slide: `## Every task runs as someone

**Objective:** explain why a job can fail on permissions, and fix it without over-granting.

**Model:** a job runs its tasks as one **identity**, a user or a **service principal**. Every read and write is checked against **that** identity's privileges, not the person who started the run. (Documented, not run.)

### Worked: the job runs as \`etl_runner\` (from the Chapter 2 grants)
- \`ingest\` writes bronze: **allowed**
- \`transform\` reads bronze and writes silver: **allowed**
- \`publish\` writes gold: **refused**, no grant on \`retail.gold\`
- Fix: \`USE SCHEMA\` and \`MODIFY\` on gold only

### Ownership and permissions
- Who may **view**, **run** or **manage** a job is a separate setting
- Owner and run-as identity are separate decisions

### Boundaries
- Prefer a service principal; never a person's credentials in code`,
  narration:
    "A job does not run as whoever clicked run. It runs its tasks as one identity, which can be a user or a service principal, and every read and write is checked against that identity's privileges. The run as setting is documented, and I did not run it, so verify the details. We already have the identity for our example, from chapter two. The job runs as the etl runner service principal. In that chapter we gave it the right to read bronze and to read and write silver, and nothing on gold. So look at each task. Ingest writes bronze, which is allowed. Transform reads bronze and writes silver, which is allowed. Publish writes gold, and that is refused, because etl runner has no grants on the gold schema. The error on the board is the shape of a denial, not an exact message. I checked the logic against the chapter two permission model, which says exactly that. The fix follows least privilege. Grant use schema and modify on the gold schema, to that one principal, and nothing broader. Who may view, run or manage the job is a separate setting, and so is its owner. Do not fix it by running the job as a person with wide access, or by putting a person's credentials into code. Prefer a service principal, give it only what the tasks need, and remember that who clicks run does not change who the job runs as. Next we assemble a whole job.",
}
