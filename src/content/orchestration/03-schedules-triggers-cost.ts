import type { Section } from '../types'

export const schedulesTriggersCost: Section = {
  id: 'schedules-triggers-cost',
  title: 'Schedules, event triggers, and freshness/cost trade-offs',
  scene: 'triggers-freshness',
  focus: 'run-count-table',
  slide: `## Start on a clock, or start on an event

**Objective:** pick a trigger by freshness need and by how often work really arrives.

**Model:** a job can start on a **schedule**, when a **file arrives**, when an input **table updates**, or run **continuously**. More starts mean fresher data and more compute spent. (Documented, not run.)

### Worked: three files a day (illustrative arithmetic)
- Hourly schedule: **24** runs a day, most with nothing new
- File arrival: **3** runs, one per file
- Nightly schedule: **1** run, results a day old

### Watch for
- A burst of files can mean a burst of runs: decide how to handle it
- A rare schedule can break a freshness promise

### Choosing
- The consumer's freshness need from Chapter 1 decides
- No price is quoted: compare on measured run cost in Chapter 9`,
  narration:
    "When should a job start? There are a few ways, all documented, not run here. A scheduled trigger starts the job at times you set with a cron expression. A file arrival trigger starts it when a new file lands in a storage location. A table update trigger starts it when an input table changes. And a continuous job runs all the time and restarts itself. The trade is freshness against compute. To make that concrete, suppose three files arrive a day. That is an assumption for illustration, not a measurement. An hourly schedule would run twenty four times a day, and most of those runs would find nothing new. A file arrival trigger would run three times, once per file. A nightly schedule would run once, and the results would be up to a day old. Watch for a burst of files, which can mean a burst of runs, and for a schedule so rare it breaks a freshness promise. None of those is automatically right. The consumer's freshness need, which we set in chapter one, decides. If finance reads a total at six in the morning, a nightly run is plenty. If a store dashboard needs fifteen minutes, an event trigger fits better. I am not quoting any prices. What each run actually costs is a measurement, and chapter nine returns to it. Next we look at what happens inside the graph when a task fails.",
}
