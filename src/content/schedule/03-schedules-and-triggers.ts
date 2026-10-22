import type { Section } from '../types'

export const schedulesAndTriggers: Section = {
  id: 'schedules-and-triggers',
  title: 'Schedules and triggers',
  scene: 'job-triggers',
  narration:
    "A job runs when something triggers it, and the documentation describes four kinds, across the top. Scheduled, by a cron expression, like ours at half past six. File arrival, when new files land in a watched location. Table update, when a source table changes. And continuous, where a new run starts as soon as the last one ends. The choice is a trade between freshness and compute, and the table underneath makes it concrete with one hypothetical assumption: each run takes ten minutes. That is not a measurement, and no prices are quoted. Run once a day, and gold can be up to a day and ten minutes old, for ten minutes of compute a day. Hourly, up to an hour and ten minutes old, for four hours a day. Every fifteen minutes, up to twenty-five minutes old, for sixteen hours. On file arrival, about ten minutes after each file lands, for one run per arrival. And continuously, ten to twenty minutes, all day. The list gives the way to choose. Ask the readers how fresh is fresh enough, because each step fresher costs more runs, and runs are compute. File arrival suits sources that land at irregular times. An incremental job, like ours, which reads only new files, makes frequent runs cheap, because a run with nothing new does almost nothing. For retail daily, the stores send their files overnight, so once a day at half past six is enough. Next, what happens when a task fails.",
}
