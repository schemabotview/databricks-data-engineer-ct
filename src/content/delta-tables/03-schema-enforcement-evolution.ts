import type { Section } from '../types'

export const schemaEnforcementEvolution: Section = {
  id: 'schema-enforcement-evolution',
  title: 'Schema enforcement, evolution, and data contracts',
  scene: 'schema-contract',
  focus: 'attempts-table',
  slide: `## Reject by default, evolve on purpose

**Objective:** predict which writes a table accepts, and say how a contract is declared.

**Model:** Delta **enforces** the table schema on write. A change must be asked for (**evolution**). Constraints such as \`NOT NULL\` and \`CHECK\` turn business rules into a **data contract** the table enforces.

### Worked: five writes to \`orders_c\` (local run)
- Extra column: **refused**, "set mergeSchema"
- \`'abc'\` into \`INT\`: **refused**, \`CAST_INVALID_INPUT\`
- \`NULL\` order_id and amount \`-5.00\`: **refused** by the constraints
- Append with \`mergeSchema\`: **accepted**; \`channel\` is added, older rows read \`NULL\`

### Misconception
- **"Evolution is automatic."** Without the option, the extra column is an error`,
  narration:
    "Data arrives in shapes we did not plan for, so a table has to decide what to accept. Delta enforces the table's schema when you write. If the data does not fit, the write is refused, and the table is left exactly as it was. Changing the schema is possible, but you have to ask for it. That is called schema evolution. On top of types, you can add rules. A not null declaration and a check constraint turn a business rule into something the table itself enforces. That is a data contract: a promise about what the table will contain, checked at the door. Here are five writes against a small copy of the orders table, run locally. A row with an extra column is refused, and the message tells you to set merge schema if you meant it. Putting the text a b c into an integer column is refused as an invalid cast. A null order id is refused by the not null rule. An amount of minus five is refused by the check constraint, which is named positive amount. Finally, an append that carries a new channel column with the merge schema option set is accepted. The table gains a channel column, and the older rows simply read null for it. The misconception is that evolution happens by itself. It does not. Without the option, that extra column is an error, which is exactly what protects downstream readers. One note: in this local version I declared not null when creating the table, because adding it later was refused. Next we look at the statements that change rows.",
}
