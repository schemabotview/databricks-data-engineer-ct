import type { Section } from '../types'

export const testsSection: Section = {
  id: 'tests',
  title: 'Tests',
  scene: 'operate-tests',
  narration:
    "The project now has tests, and the terminal runs them with pytest: seven passed. They are three kinds, and the table on the right counts them. Four unit tests, in the quality test file, each check one rule or one function on rows written in the test itself: an unreadable amount, a negative amount, an unknown store, and that latest keeps the row from the newest file. One integration test, in the editor's file, runs the whole flow on files a to d and checks that gold totals one hundred and seventy. And two data-quality tests check the tables it built: that every one of the eleven events is accounted for, six in silver, one resend, one superseded, three quarantined, and that completed sales in silver equal the total in gold. A session fixture runs all of them in a scratch copy of the project, so the tests never touch the project's own tables. The second command shows why tests like these matter. The tool contains a bug that raises no error: it keeps the oldest file's row instead of the newest. Run, it would quietly publish wrong data. The tests' helper compares it with the correct result as rows, and prints exactly what differs. For order four, the same row, but from the older file. For order six, pending has come back instead of completed. The list sums it up: a diff you can read beats a test that only says false. And all of this runs locally, before anything is deployed. Next, the bundle that does the deploying.",
}
