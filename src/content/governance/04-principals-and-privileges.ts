import type { Section } from '../types'

export const principalsAndPrivileges: Section = {
  id: 'principals-and-privileges',
  title: 'Users, groups, service principals, privileges, and least privilege',
  scene: 'least-privilege',
  focus: 'who-can',
  slide: `## Grant the least that works

**Objective:** read GRANT statements and predict who can do what.

**Model:** privileges go to **principals**: users, **groups** and **service principals**. They are granted on an object and **inherited** by everything beneath it. Reading a table needs \`USE CATALOG\`, \`USE SCHEMA\` and \`SELECT\`.

### Worked: three principals (documented, not run)
- **analysts** can read \`gold\` only
- **data_engineers** have all privileges on \`bronze\` and \`silver\`
- **etl_runner**, a service principal, reads \`bronze\` and writes \`silver\`
- As analysts, \`SELECT\` on \`silver.orders\` is denied

### Habits that scale
- Grant to **groups**, so access follows team membership
- A grant on \`silver\` also covers tables created there later

### Misconception
- **"SELECT is enough."** Without \`USE CATALOG\` and \`USE SCHEMA\` the table is out of reach`,
  narration:
    "Permissions go to principals. A principal can be a user, a group of users, or a service principal, which is an identity for automation such as a scheduled job. Prefer groups for people, so that access follows team membership rather than individuals. Privileges are granted on an object and are inherited by the objects beneath it. Grant select on a schema and it covers every table in that schema. To read a table you need three things: use catalog on its catalog, use schema on its schema, and select on the table or an ancestor. Here are the grants for our retail example. Analysts get use catalog on retail, and use schema and select on the gold schema, so they can read gold and nothing else. Data engineers get all privileges on bronze and silver. The ETL service principal can read bronze and read and write silver, and nothing more, which is least privilege: the smallest grant that lets the work happen. The matrix shows the result. And if an analyst runs a select on silver orders, it is refused, because they hold none of the three required privileges there. The error text on the board is the shape of a denial, not an exact message. Two habits make this scale. Grant to groups, so access follows team membership. And remember that a grant on the silver schema also covers tables created there later, so review grants when you add objects. One misconception to avoid is that select alone is enough. Without use catalog and use schema, the table cannot be reached. The matrix was checked against a small model of these rules, not against a live metastore, so treat this section as documented, not run. Next we connect these permissions to cloud storage.",
}
