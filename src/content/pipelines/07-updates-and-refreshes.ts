import type { Section } from '../types'

export const updatesAndRefreshes: Section = {
  id: 'updates-and-refreshes',
  title: 'Updates and refreshes',
  scene: 'pipeline-refresh',
  narration:
    "A pipeline runs in updates, and there are three ways to start one, documented here. An ordinary update runs the whole graph: streaming tables take only their new rows, and materialized views are brought up to date. A refresh of selected datasets runs only the ones you name. And a full refresh clears streaming tables and reads their sources again from the very beginning. The first two are routine. The third is the dangerous one, and the table underneath shows why with this project's own source contract. A full refresh of bronze orders rebuilds it from whatever the landing volume still holds. If the volume holds every file ever sent, bronze comes back the same. But course six's contract says the stores' order files are kept for thirty days. Then a full refresh leaves only the last thirty days, and everything older is gone, from bronze and from everything built on it. And a file deleted since it was read is simply missing. The list is the rule that follows. A full refresh rebuilds from what the source still holds, and bronze may be the only copy of older data. So protect such tables from a reset. The documentation describes a table setting for that, and its name, pipelines dot reset dot allowed, is unverified here and must be checked before use. When a downstream result is wrong, refresh the views downstream, which are computed from bronze, rather than bronze itself. Next, how to read what an update did.",
}
