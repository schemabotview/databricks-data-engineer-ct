import type { Section } from '../types'

export const failureAndRecoveryCritique: Section = {
  id: 'failure-and-recovery-critique',
  title: 'Failure and recovery critique',
  scene: 'defend-critique',
  narration:
    "A design is only as good as its behaviour on a bad day, so this section critiques it failure by failure. It starts with one more run, a changed requirement about latency: readers want silver fresher than once a day. The tool keeps silver up to date with micro-batches instead of a full rebuild: each batch's valid rows, reduced to the latest per order, merged into a fresh copy, and a row is replaced only by a newer file. The terminal applies three batches, then replays the middle one, as a retry would. Six orders, six, eight, and still eight after the replay. And the last line compares the result with the full rebuild: equal. So the latency change is safe, by the same merge pattern course eight used. The table on the right is the critique. A missing file is caught by the row-count condition of course ten. A duplicate or a replay is absorbed by a merge on the key, shown in course eight, course ten and here. Out-of-order changes are handled by the sequence guard. Lost access is found early by checking run as against the grants. Lost history is recoverable only from raw records kept in bronze. And schema drift is the weak point, which the list names. In course six, a fixed schema read twelve comma fifty as one thousand two hundred and fifty, with no error. None of this project's rules would catch a plausible wrong amount. That is a real gap, and the honest next step is a range check on amounts, or keeping unparseable values in a rescued column. Next, writing the decisions down.",
}
