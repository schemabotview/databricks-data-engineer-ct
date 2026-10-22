import type { Section } from '../types'

export const predictiveOptimization: Section = {
  id: 'predictive-optimization',
  title: 'Predictive optimization',
  scene: 'fast-predictive',
  narration:
    "The last two sections ran optimize by hand. On Databricks, the documentation describes predictive optimization, which decides when maintenance is worth running and runs it for you. This frame is documented, not run. Across the top is what it runs: optimize, for compaction and clustering; vacuum, to remove old files past retention; and analyze, to keep the statistics the query planner uses. The table underneath says where it applies, as the documentation's summaries describe it, to be checked again before relying on it. It works on Unity Catalog managed tables. It does not run Z-order. It is not available in every region. It is on by default for accounts created from the eleventh of November twenty twenty-four. And cluster by auto, where the platform chooses the clustering columns itself, needs it enabled. The list says what stays yours even when it is on. Choosing what to cluster by, unless you hand that choice to auto. Setting retention long enough for time travel and for recovery, which course eight showed is a recovery decision, not only a storage one. Maintaining external tables, which it does not manage. And checking that it actually ran: its operations are recorded in a system table, so you can query what it did rather than assume. Next, putting the measurements together into a comparison you can defend.",
}
