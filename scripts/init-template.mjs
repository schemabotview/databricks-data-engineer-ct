// Mechanical half of the TEMPLATE.md checklist: the swaps that are pure string substitution.
//
//   node scripts/init-template.mjs <slug> "<Subject>" [brand-hex]
//   node scripts/init-template.mjs spark "Apache Spark" "#e25a1c"
//
// What it does NOT do, because none of it is mechanical: pick --brand-hover / --accent-2 beyond a
// naive lighten, write the hashtags, rewrite README.md / CLAUDE.md, or delete the demo course.
// Those are the remaining `SWAP:` markers — `grep -rn 'SWAP' --exclude-dir=node_modules .`
import { readFileSync, writeFileSync } from 'node:fs'

const [slug, subject, brand = '#64748b'] = process.argv.slice(2)
if (!slug || !subject) {
  console.error('usage: node scripts/init-template.mjs <slug> "<Subject>" [brand-hex]')
  process.exit(1)
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error(`✗ slug must be lowercase kebab-case (it is the repo name, the vite base and the path under graphl.in): ${slug}`)
  process.exit(1)
}
if (!/^#[0-9a-fA-F]{6}$/.test(brand)) {
  console.error(`✗ brand must be a 6-digit hex colour: ${brand}`)
  process.exit(1)
}

/** Mix `hex` toward white by `amount` (0..1) — a starting point for --brand-hover, not a choice. */
function lighten(hex, amount) {
  const n = parseInt(hex.slice(1), 16)
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(c + (255 - c) * amount))
  return '#' + ch.map((c) => c.toString(16).padStart(2, '0')).join('')
}
const hover = lighten(brand, 0.3)

// Each entry is [file, [[find, replace], ...]]. `find` is a literal string, so a miss is detectable
// and reported rather than silently doing nothing — this script runs once, on a repo nobody has
// looked at yet, and a silent no-op there is how an unswapped `base` reaches production.
const edits = [
  ['package.json', [['"name": "content-repo-template"', `"name": "${slug}"`]]],
  ['index.html', [['<title>Template — GraphL scenes</title>', `<title>${subject} — GraphL scenes</title>`]]],
  ['vite.config.ts', [["'/content-repo-template/'", `'/${slug}/'`]]],
  ['src/main.tsx', [['subject="Template"', `subject="${subject}"`]]],
  [
    'src/theme.css',
    [
      ['--brand: #64748b;', `--brand: ${brand};`],
      ['--brand-hover: #94a3b8;', `--brand-hover: ${hover};`],
    ],
  ],
  [
    'public/favicon.svg',
    [
      ['aria-label="Template — GraphL"', `aria-label="${subject} — GraphL"`],
      ['fill="#64748b"', `fill="${brand}"`],
      ['>T</text>', `>${subject[0].toLowerCase()}</text>`],
    ],
  ],
  [
    'scripts/concept.json',
    [
      ['"concept": "Template"', `"concept": "${subject}"`],
      ['"appPath": "/content-repo-template"', `"appPath": "/${slug}"`],
    ],
  ],
]

const missed = []
for (const [file, pairs] of edits) {
  let src = readFileSync(file, 'utf8')
  for (const [find, replace] of pairs) {
    if (!src.includes(find)) {
      missed.push(`${file}: ${find}`)
      continue
    }
    src = src.split(find).join(replace)
  }
  writeFileSync(file, src)
  console.log(`  ${file}`)
}

if (missed.length) {
  console.error(`\n✗ ${missed.length} placeholder(s) not found — already run, or the file was edited:`)
  for (const m of missed) console.error('  ' + m)
  process.exit(1)
}

console.log(`\n✓ ${slug} / "${subject}" / ${brand} (hover ${hover})`)
console.log('\nStill yours to do:')
console.log('  --accent-2 in src/theme.css, and panelBg + hashtags in scripts/concept.json')
console.log('  README.md and CLAUDE.md')
console.log('  delete the demo course: src/content/demo, src/scenes/demo, public/audio/demo + both registries')
console.log("  grep -rn 'SWAP' --exclude-dir=node_modules .")
