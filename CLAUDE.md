# CLAUDE.md — databricks-data-engineer-ct

A **content repo**, not an app. It holds the **Databricks Data Engineer** concept, authored **video-first** for the `graphl-movie` app (sibling repo), which loads it **at runtime**. No render engine and no scenes live here — the app fetches this repo's `manifest.json` + notebooks + slides over the network and renders/records them. Read alongside the workspace map in `../CLAUDE.md`, the app contract in `../graphl-movie/CLAUDE.md`, and the mature reference `../apache-spark-content/CLAUDE.md`.

This is the first `-ct` (video-target) content repo. It is authored **fresh** — the existing `../databricks-data-engineer-content` (the graphl-ux-era repo) and `~/Projects/databricks-data-engineer` (the source curriculum) are **reference material**, not something to copy wholesale. We are refining structure, not porting it.

There is **nothing to build, run, or test** here. The one executable (later) is a Colab tool that turns `tts/` scripts into `audio/` `.wav`s.

## Working agreement

Same as the app repo: **step by step, one small slice, review gate between each.** We are not authoring notebooks/tts/slides/audio yet — we settle the shape first (module categorization → sections → …), then fill content deliberately. No batch generation.

## The core contract (from graphl-movie — do not break)

1. **The notebook is the single source of truth** for a section's prose and code. `manifest.json` only *wires* — it must never duplicate notebook content.
2. **One notebook per section** (not per module): each `.ipynb` holds exactly one `## ` section. The section is the atomic unit across all four artifacts — `.ipynb` + `.tts` + `.slide` + `.wav` share the same `NN-SS-slug` stem — so a section can be authored and reviewed on its own. The manifest references each artifact by path; the notebook's single `## ` heading is the section title (mirror it in the manifest `heading`).
3. Each section is the unit the video steps through and has its own **`.ipynb`** (prose/code), **`.tts`** (narration script), **`.wav`** (generated audio), and — new for video — a **`.slide`** file (the authored right-pane bullets: title + concise bullets). Module title/lede lives in `README.md` + the manifest, not in the section notebooks.
4. A section's diagram images (`![]()`) are **stripped** by the app — the React Flow **scene** replaces them.
5. **Scenes live in the `graphl-movie` app** (`src/scenes/*`), authored with the engine's pattern helpers. Here you only reference a scene **by id**, plus `highlight` (node ids that light AMBER) and `focus` (a node id the camera frames) per section.

## Folder layout

```
databricks-data-engineer-ct/
  notebooks/   # one .ipynb per SECTION (one ## section each) — source of truth for prose/code
  tts/         # one .tts per section (plain spoken narration script)
  audio/       # one .wav per section (generated from tts/ via Colab)
  slides/      # one .slide per section (authored right-pane title + bullets)
  manifest.json  # (later) wires sections → notebook / slide / scene / highlight / focus / audio
  CLAUDE.md · README.md
```

Naming: every artifact for a section shares the stem `<NN>-<SS>-<slug>`, where `NN` = module number, `SS` = section position (so a sorted glob stays in reading order): `notebooks/<NN>-<SS>-<slug>.ipynb`, `tts/…​.tts` → `audio/…​.wav`, `slides/…​.slide`.

The `.slide` format: a `# Title` line + `- bullet` lines. Each bullet marks its **key term** with inline **`**bold**`** — the app renders it bright white, the rest a softer gray (scannable hierarchy). Title may be punchier than the notebook `## ` heading.

## Curriculum

The course outline (module spine + per-module sections) lives in [`README.md`](./README.md) — the single human-facing source for structure while we plan; `manifest.json` becomes the machine source of truth once authored. Don't duplicate the module/section list here.

**Agreed:** 9 thematic modules (practice-exam module dropped from the video set), Delta Lake + Unity Catalog kept together as module 02. Sections per module target ~10–12 and are being refined next.

## Status

Structure settled ([`README.md`](./README.md): **9 modules, 90 sections**). Pushed public at `github.com/schemabotview/databricks-data-engineer-ct` (fetched by the app over raw GitHub).

- **Module 01 — complete & recordable end-to-end** (10 sections): `notebooks/01-*.ipynb` + `tts/01-*.tts` + `slides/01-*.slide` + `audio/01-*.wav` (audio generated via `scripts/colab_generate_audio.ipynb`). `manifest.json` wires all 10 sections with `scene`/`highlight`/`focus`/`audio`/`slide`. The graphl-movie app records module 01 to a 1080p video.
- **Scenes are app-side** (`graphl-movie/src/scenes`): §01 rides `lakehouse-evolution`, §02–10 ride the dense `databricks-data-engineer` platform map (framed per section). Highlight/focus ids in the manifest must match those scenes' node ids.
- **Modules 02–09** — not started (section lists agreed in `README.md`; repeat the module-01 pipeline).

Next: author module 02 (`notebook → .tts → .slide` per section), generate audio, wire the manifest.
