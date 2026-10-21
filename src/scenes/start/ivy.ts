import { trim } from '../ide'

// Every run of a Delta session begins the same way: the JVM's one-line notice about an incubating
// module (every Spark 4 run on Java 21 prints it), then Ivy's resolution report — Spark adds Delta's
// jars through spark.jars.packages and prints the report on every start (it silences it only in its
// own tests). §3 shows both and explains them; every later frame folds them to one `··· N lines`
// mark — the same mark the editor uses — so the 17-line terminal keeps its lines for the lesson.
export function quietIvy(session: string): string {
  const lines = trim(session).split('\n')
  const out: string[] = []
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith('WARNING: Using incubator modules')) {
      out.push(lines[i])
      continue
    }
    const end = lines.findIndex((l, j) => j > i && l.includes('already retrieved'))
    out.push(`··· ${end - i + 1} lines: Java starts, Ivy finds Delta's jars`)
    i = end
  }
  return out.join('\n')
}
