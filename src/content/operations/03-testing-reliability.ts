import type { Section } from '../types'

export const testingReliability: Section = {
  id: 'testing-reliability',
  title: 'Unit, integration, and data-quality tests as worked reliability techniques',
  scene: 'test-layers',
  focus: 'diff-card',
  slide: `## Tests that say what went wrong

**Objective:** choose a test layer for a risk, and write a failure that is readable.

**Model:** **unit** tests check one function on small inputs. An **integration** test runs the whole flow. **Data-quality** tests assert properties the output must always have.

### Worked: the example's 7 tests (real run, 7 passed)
- 4 unit tests: exact rows for typing, rules, latest-per-order, duplicate keys
- 1 integration test: 11 events become 6 silver and 3 quarantined, gold 170.00
- 2 data-quality tests: one row per order; gold equals silver detail

### Why three layers
- Unit tests are fast and pinpoint the function
- Integration tests catch wiring; quality tests catch odd data

### A readable failure
- A buggy variant sorted **ascending**; the diff says what is **missing** and what is **unexpected**`,
  narration:
    "Tests are how a pipeline earns the right to change. There are three layers, and each guards a different risk. A unit test checks one function on a small input and compares exact rows. An integration test runs the whole flow and checks each layer. And data quality tests assert properties that the output must always have, whatever the input. The example project has seven tests, and I ran them: seven passed. Four are unit tests, covering typing the columns, naming the failing rule, keeping the latest event per order with its tie breaker, and showing that a duplicate store key inflates a total. One integration test checks that eleven events become six silver orders and three quarantined rows, with a gold total of one hundred seventy. Two data quality tests check that silver has one row per order and no null amounts, and that gold equals the silver detail. Each layer catches something the others miss: unit tests are fast and pinpoint the function, integration tests catch wiring, and quality tests catch data nobody anticipated. Then there is the quality of a failure. I wrote a deliberately buggy variant that sorts ascending, so the oldest event wins, and ran it through the same comparison. Instead of a bare assertion error, it said what was missing, order six completed from file d, and what was unexpected, order six pending from file b. A failing test that names the wrong row is worth a lot at three in the morning. Next we look at declaring where code deploys.",
}
