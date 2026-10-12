import type { Section } from '../types'

export const schemaInferenceEvolution: Section = {
  id: 'schema-inference-evolution',
  title: 'Schema inference, evolution, and unexpected type changes',
  scene: 'schema-drift',
  focus: 'drift-table',
  slide: `## A changed file can corrupt without an error

**Objective:** predict what a fixed schema and inference each do to a changed file.

**Model:** a **fixed schema** keeps the table stable but ignores what it does not know. **Inference** follows the data, so a column's type can change under you.

### Worked: two JSON files (local run)
- Fixed schema: the new \`channel\` field is **silently missing**
- Fixed schema: the string \`"12,50"\` became **1250.00**, with no flag
- Inferred over both files: \`amount\` is **string**, \`channel\` is **string**
- File 1 alone inferred \`amount\` as **double**

### Why it matters
- Neither read raised an error
- Auto Loader's evolution modes (documented) make the choice explicit`,
  narration:
    "Sources change, and when they do, what happens depends on how you read them. Here are two small JSON files from a local run. The first is a normal order. The second has two surprises: the amount is the text twelve comma fifty, in the European style, and there is a new field called channel. Read them with a fixed schema, and two things happen silently. The new channel field is simply not there. And, more worrying, the text twelve comma fifty was parsed as one thousand two hundred fifty, with no error and no flag. The comma was treated as a thousands separator. That is a wrong value, delivered quietly. Now read them with schema inference instead. The amount column is inferred as a string, because it must hold both forms, and channel is a string. Read the first file alone and the amount was inferred as a double. So with inference, a column's type can change underneath you when an odd file arrives. Neither read raised an error. That is the lesson. A fixed schema protects the table but can hide drift, and inference follows the data but can change types. Auto Loader offers evolution modes that make the choice explicit: add new columns, rescue unexpected data, fail on new columns, or ignore changes. Those are documented, not run, so check the names. Next we look at keeping data that cannot be read.",
}
