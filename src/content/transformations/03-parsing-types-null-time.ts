import type { Section } from '../types'

export const parsingTypesNullTime: Section = {
  id: 'parsing-types-null-time',
  title: 'Parsing, types, NULL, nested records, and timestamp assumptions',
  scene: 'types-nulls-time',
  focus: 'assumption-table',
  slide: `## Four ways to change a number silently

**Objective:** spot the assumption behind a value before it reaches a total.

**Model:** each of these runs without an error and still changes the answer. State the assumption, then test it.

### Worked (local run)
- \`try_cast('n/a')\` gives \`NULL\`; \`'-5.00'\` **parses**, so "is it a number" is not "is it valid"
- \`amount = NULL\` matched **0** rows; \`IS NULL\` matched **1**
- \`09:14\` read under UTC and New York time is **14,400 s** apart
- Exploding line items repeats an order-level amount: **65.00** became **105.00**

### Test it
- Count rows before and after each step
- Compare a total to a figure you already trust

### Rule of thumb
- Say the time zone, the type and the grain out loud
- Parsing succeeding proves nothing about meaning`,
  narration:
    "Many wrong numbers in a data pipeline come from an assumption nobody stated, and none of them raise an error. Here are four, from a local run. First, parsing. Casting the text n slash a to a decimal safely gives null. But minus five parses perfectly well as a number. So being able to parse a value is not the same as the value being valid, and that is a separate check. Second, null. Comparing a column to null with an equals sign matches no rows at all, because null is not equal to anything, not even null. Using is null matched the one row we expected. Third, time. The text nine fourteen, with no zone, becomes an instant only when you read it in a time zone. Read in UTC and in New York, the same text gives two instants fourteen thousand four hundred seconds apart, which is four hours. So say which zone you mean. Fourth, nested data. An order has an amount and a list of line items. Exploding the line items gives one row per item, so an order level amount repeats. Summing it after the explode turned sixty five into one hundred and five. Test each of these by counting rows before and after each step, and by comparing a total to a figure you already trust. The rule of thumb is to say the time zone, the type and the grain out loud before you aggregate. Next we meet the same problem again, in joins.",
}
