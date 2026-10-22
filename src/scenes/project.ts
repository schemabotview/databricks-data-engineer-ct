import type { TreeEntry } from '@graphlearning/flow'

// The explorer for any step of retail-lakehouse: give it the project's files as paths, the open one,
// and what the section adds. Folders come first, then files, each alphabetical, as an editor shows
// them; a path ending in `/` is a folder shown closed (with an optional note after a space:
// 'data/landing/ CSV'), and a path starting with `~` is something a run generated (Spark's
// warehouse, the local metastore), shown muted. Folders named in `collapse` are shown closed with a
// count, unless the open file is inside — the explorer must fit its pane, and a tree taller than the
// frame moves every panel.
export function projectTree(paths: string[], active: string, fresh: string[] = [], collapse: string[] = []): TreeEntry[] {
  const root: TreeEntry[] = [{ name: '.venv', folder: true, state: 'muted', note: 'activated' }]
  const state = (path: string): TreeEntry['state'] => (path === active ? 'active' : fresh.some((f) => path === f || path.startsWith(f.replace(/\/?$/, '/'))) ? 'new' : undefined)
  for (const raw of paths) {
    const muted = raw.startsWith('~')
    const [path, ...note] = (muted ? raw.slice(1) : raw).split(' ')
    const parts = path.replace(/\/$/, '').split('/')
    let level = root
    parts.forEach((name, i) => {
      const last = i === parts.length - 1
      const here = parts.slice(0, i + 1).join('/')
      let entry = level.find((e) => e.name === name)
      if (!entry) {
        entry = last && !path.endsWith('/') ? { name } : { name, folder: true }
        if (last && path.endsWith('/')) entry = { name, folder: true, note: note.join(' ') || undefined }
        if (last && muted) entry.state = 'muted'
        if (!last) entry.children = []
        const s = state(last ? path.replace(/\/$/, '') : here)
        if (s && (last || s === 'new')) entry.state = s
        level.push(entry)
      }
      if (!last) level = entry.children ?? (entry.children = [])
    })
  }
  const count = (e: TreeEntry): number => (e.children ? e.children.reduce((n, c) => n + count(c), 0) : 1)
  const sort = (entries: TreeEntry[], at: string): TreeEntry[] =>
    entries
      .map((e) => {
        const here = at ? `${at}/${e.name}` : e.name
        if (e.children && collapse.includes(here) && !active.startsWith(`${here}/`) && e.state !== 'new')
          return { name: e.name, folder: true, note: `${count(e)} file${count(e) === 1 ? '' : 's'}` }
        return e.children ? { ...e, children: sort(e.children, here) } : e
      })
      .sort((a, b) => Number(!(a.folder || a.children)) - Number(!(b.folder || b.children)) || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  return sort(root, '')
}

// The tree as a frame from Course 6 on shows it: every folder closed (with its file count) except the
// ones that hold the open file or a file new in this section, and their other files folded. The project keeps growing, and an open
// tree taller than the explorer pane would grow the frame and move every panel.
export function focusTree(paths: string[], active: string, fresh: string[] = []): TreeEntry[] {
  const keep = [active, ...fresh].map((p) => p.replace(/\/$/, ''))
  const folders = new Set<string>()
  for (const raw of paths) {
    const parts = raw.replace(/^~/, '').split(' ')[0].replace(/\/$/, '').split('/')
    const last = raw.split(' ')[0].endsWith('/') ? parts.length : parts.length - 1
    for (let i = 1; i <= last; i++) folders.add(parts.slice(0, i).join('/'))
  }
  const collapse = [...folders].filter((f) => !keep.some((k) => k === f || k.startsWith(`${f}/`)))
  // inside an open folder, the files that are neither open nor new fold to one `··· N files` row —
  // the editor's fold mark
  const fold = (entries: TreeEntry[]): TreeEntry[] => {
    const quiet = entries.filter((e) => !e.folder && !e.children && e.state !== 'active' && e.state !== 'new')
    const rest = entries.filter((e) => !quiet.includes(e)).map((e) => (e.children ? { ...e, children: fold(e.children) } : e))
    return quiet.length > 1 ? [...rest, { name: `··· ${quiet.length} files`, state: 'muted' }] : [...rest, ...quiet]
  }
  return fold(projectTree(paths, active, fresh, collapse))
}
