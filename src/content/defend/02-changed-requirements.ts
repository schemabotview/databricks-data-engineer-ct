import type { Section } from '../types'

export const changedRequirements: Section = {
  id: 'changed-requirements',
  title: 'Changed requirements',
  scene: 'defend-requirements',
  narration:
    "A design is tested by change. This section brings two changed requirements to the project and runs both through its own modules, unchanged except for one new file. The terminal starts from the base: files a to d, gold totals one hundred and seventy. The first change is a historical correction. A new file, orders e, says order four's amount was really eighteen, not fifteen. Nothing in the code changes: silver already keeps the row from the newest file, so the correction simply wins. Silver still has six orders, York becomes eighteen, and gold totals one hundred and seventy-three. The second change is a new source. A partner sends orders keyed by a store code, L D S, Y R K, rather than our store ID. That needs the one new module, in the editor, partner dot py. It reads the partner's files as a stream with its own checkpoint, joins each code to our store ID through a small reference file, and appends the result to bronze. An unknown code becomes a null store ID, and the existing rule, unknown store, quarantines it, with no new rule needed. Silver now has eight orders, gold has Leeds four orders, one hundred and five, York two, thirty, Hull one, eighty, and the total is two hundred and fifteen. The table below the run shows the quarantine: orders seven, eight and nine, as before, and partner order three with its unknown code. And the reconciliation still closes: fifteen rows in bronze equal eight in silver, three older versions, and four quarantined. Next, choosing between the platform's ways of running a flow.",
}
