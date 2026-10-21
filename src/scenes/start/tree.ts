import type { TreeEntry } from '@graphlearning/flow'

// retail-lakehouse as each step of Course 3 leaves it. `step` is the spine step (2 to 6); `active` is
// the file open in the editor; `fresh` marks what the section adds. What a run generates (Spark's
// warehouse and the local metastore) is shown muted: it is on disk and in .gitignore, never edited.
// The egg-info folder `pip install -e .` writes under src/ is left out: its name alone is wider than
// the explorer, and nothing in the course opens it.
export function startTree(step: number, active: string, fresh: string[] = []): TreeEntry[] {
  const state = (path: string): TreeEntry['state'] => (path === active ? 'active' : fresh.includes(path) ? 'new' : undefined)
  const file = (path: string): TreeEntry => ({ name: path.split('/').pop()!, state: state(path) })
  const generated = (name: string): TreeEntry => ({ name, folder: true, state: 'muted' })
  if (step === 2) return [{ name: '.venv', folder: true, state: 'muted', note: 'activated' }, file('requirements.txt')]
  const tree: TreeEntry[] = [
    { name: '.venv', folder: true, state: 'muted', note: 'activated' },
    { name: 'conf', state: state('conf'), children: [file('conf/log4j2.properties'), file('conf/spark-defaults.conf')] },
  ]
  if (step >= 4) tree.push(generated('metastore_db'))
  if (step >= 6) tree.push({ name: 'notebooks', children: [file('notebooks/explore.py')] })
  if (step >= 4) tree.push(generated('spark-warehouse'))
  tree.push({
    name: 'src',
    children: [
      { name: 'retail', children: [file('src/retail/__init__.py'), file('src/retail/session.py')] },
    ],
  })
  if (step >= 4)
    tree.push({ name: 'tools', children: [file('tools/load_sample.py'), ...(step >= 5 ? [file('tools/first_query.py')] : [])] })
  tree.push(file('.gitignore'))
  if (step >= 4) tree.push({ name: 'derby.log', state: 'muted' })
  tree.push(file('pyproject.toml'), file('requirements.txt'))
  return tree
}
