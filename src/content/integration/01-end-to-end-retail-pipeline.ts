import type { Section } from '../types'

export const endToEndRetailPipeline: Section = {
  id: 'end-to-end-retail-pipeline',
  title: 'End-to-end retail pipeline: source contracts through governed consumption',
  scene: 'architecture-guarantees',
  focus: 'guarantee-table',
  slide: `## Why each component is there

**Objective:** explain what each part of the retail design is for, and which kind of component guarantees what.

**Model:** a guarantee always comes from **somewhere specific**: storage, processing, orchestration, governance, or the external source. Naming the source is how you avoid claiming more than the design delivers.

### Worked: the retail design, Chapters 1 to 10
- **Atomic commits and history**: storage (Delta tables)
- **One row per order**: processing (a keyed, sequence-guarded merge)
- **Order and retries**: orchestration (a job). **Who may read**: governance (grants)
- **How far back to replay**: the source's **retention**, not ours

### Ask of every component
- Which guarantee does this provide?
- What happens if it fails or is wrong?

### Misconception
- **"The platform makes it exactly once."** Each guarantee has an owner`,
  narration:
    "We now have every piece of a retail data product, so let's explain why each piece is there. The most useful habit in design review is to name where each guarantee comes from. A guarantee always comes from somewhere specific. It can come from storage, from processing, from orchestration, from governance, or from the external source. If you cannot say which, you are probably claiming more than the design delivers. Look at the retail design from chapters one to ten. The order files come with a contract and a retention. Bronze keeps what arrived, with the source file. Silver is typed, keyed, and the latest event wins. Gold is a summary per store, which started at one hundred seventy dollars. And the consumers are finance and the dashboard. Now the guarantees. Atomic commits and history come from storage, the Delta tables. One row per order comes from processing, a keyed merge with a sequence guard. Order of execution and retries come from orchestration, a job. Who may read comes from governance, the grants. And how far back you can replay comes from the source's own retention, not from anything we built. Ask of every component which guarantee it provides, and what happens if it fails. The misconception to avoid is that the platform makes the whole thing exactly once. Each guarantee has an owner, and some of them are not ours. A note on status: Unity Catalog, Auto Loader, pipelines and jobs were documented in this course, not run. Next we change the requirements.",
}
