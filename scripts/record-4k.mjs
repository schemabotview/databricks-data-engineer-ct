#!/usr/bin/env node
// Drives @graphlearning/shell's record-course over this repo's courses at 4K.
//
// Two things this adds over calling `graphl-record` directly:
//   1. caffeinate — a full pass is ~2h of encoding; macOS idle-sleeping mid-run kills the
//      dev server and the headless browser with it.
//   2. an audio gate — a section with no wav records 3s of silence and writes a sidecar
//      fingerprinted `silence3`. That is a real segment on disk that no later run reuses,
//      so recording a half-narrated course is work thrown away. A course is recorded only
//      once every one of its sections has a wav.
//
// The 2.4s loop is record-course's own default (PULSE_S): it records a 3.4s window
// (0.5 lead + 2.4 pulse + 0.5 guard), cuts the 2.4s pulse out, and -stream_loop's it to
// the narration's length. Capture cost is flat per section; only encoding scales.
//
//   node scripts/record-4k.mjs                 every ready course, in syllabus order
//   node scripts/record-4k.mjs foundations …   just these
//   node scripts/record-4k.mjs --dry-run       report coverage, record nothing
//   node scripts/record-4k.mjs --force         re-record even where the sidecar matches

import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const repoDir = resolve(import.meta.dirname, '..')
const manifestPath = join(repoDir, 'scripts', 'audio-manifest.json')
if (!existsSync(manifestPath)) {
  console.error('No scripts/audio-manifest.json — run `npm run gen:audio` first.')
  process.exit(2)
}

const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run')
const force = argv.includes('--force')
const wanted = argv.filter((a) => !a.startsWith('--'))

const { entries } = JSON.parse(readFileSync(manifestPath, 'utf8'))
const courses = []
for (const e of entries) {
  let c = courses.find((x) => x.id === e.course)
  if (!c) courses.push((c = { id: e.course, total: 0, have: 0, missing: [] }))
  c.total++
  if (existsSync(join(repoDir, 'public', 'audio', e.file))) c.have++
  else c.missing.push(e.section)
}

const selected = wanted.length ? courses.filter((c) => wanted.includes(c.id)) : courses
for (const id of wanted) {
  if (!courses.some((c) => c.id === id)) {
    console.error(`Unknown course "${id}". Known: ${courses.map((c) => c.id).join(', ')}`)
    process.exit(2)
  }
}

const ready = selected.filter((c) => c.have === c.total)
const waiting = selected.filter((c) => c.have !== c.total)

console.log('Audio coverage')
for (const c of selected) {
  const mark = c.have === c.total ? '✓' : '·'
  const tail = c.have === c.total ? '' : `  waiting on ${c.missing.length}: ${c.missing.slice(0, 3).join(', ')}${c.missing.length > 3 ? ' …' : ''}`
  console.log(`  ${mark} ${c.id.padEnd(16)} ${String(c.have).padStart(2)}/${c.total}${tail}`)
}

if (!ready.length) {
  console.log('\nNothing fully narrated yet — nothing to record.')
  process.exit(0)
}
console.log(`\n${ready.length} course(s) ready: ${ready.map((c) => c.id).join(', ')}`)
if (dryRun) process.exit(0)

const bin = join(repoDir, 'node_modules', '.bin', 'graphl-record')
const failed = []
for (const c of ready) {
  console.log(`\n${'─'.repeat(60)}\n▶ ${c.id} — ${c.total} sections @ 3840×2160\n${'─'.repeat(60)}`)
  const args = ['-i', bin, c.id, ...(force ? ['--force'] : [])]
  const code = await new Promise((res) => {
    spawn('caffeinate', args, { cwd: repoDir, stdio: 'inherit', env: process.env }).on('exit', res)
  })
  if (code !== 0) {
    failed.push(c.id)
    console.error(`✗ ${c.id} exited ${code} — continuing`)
  }
}

console.log(`\n${'═'.repeat(60)}`)
console.log(`recorded ${ready.length - failed.length}/${ready.length} course(s) → scripts/out/<course>.mp4`)
if (failed.length) console.log(`failed: ${failed.join(', ')}`)
if (waiting.length) console.log(`still waiting on audio: ${waiting.map((c) => `${c.id} (${c.have}/${c.total})`).join(', ')}`)
process.exit(failed.length ? 1 : 0)
