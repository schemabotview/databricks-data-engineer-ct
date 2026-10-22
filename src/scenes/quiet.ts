import { trim } from './ide'
import { quietIvy } from './start/ivy'

// What a terminal frame folds, beyond what a lesson chooses with fold():
//   - the JVM notice and Ivy's report at the start of every Delta session (./start/ivy.ts);
//   - PySpark 4's JSON error log. Before raising a SQL or DataFrame error, PySpark logs it as ONE
//     JSON line carrying the whole Java stack — a hundred-odd lines once wrapped at the terminal's 84
//     columns;
//   - Spark's own log lines (`ERROR Executor: …`, `WARN TaskSetManager: …`): when a write is refused
//     on an executor, Spark logs the lost task before the driver raises the error.
// All of it is real, and the error a script catches says the same in one line, so each run of it is
// folded to one `··· N lines` mark. A wrapped line is exactly 84 characters, so an entry runs until
// the first shorter line.
const COLUMNS = 84
const LOG = /^(\{"ts": |(ERROR|WARN) \w+: )/

export function quiet(session: string): string {
  const lines = trim(quietIvy(session)).split('\n')
  const out: string[] = []
  for (let i = 0; i < lines.length; i++) {
    if (!LOG.test(lines[i])) {
      out.push(lines[i])
      continue
    }
    let end = i
    for (;;) {
      while (end + 1 < lines.length && lines[end].length === COLUMNS) end++
      if (end + 1 < lines.length && LOG.test(lines[end + 1])) end++
      else break
    }
    out.push(`··· ${end - i + 1} lines: Spark's logs`)
    i = end
  }
  return out.join('\n')
}
