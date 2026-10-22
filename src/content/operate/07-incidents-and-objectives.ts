import type { Section } from '../types'

export const incidentsAndObjectives: Section = {
  id: 'incidents-and-objectives',
  title: 'Incidents and objectives',
  scene: 'operate-objectives',
  narration:
    "An incident should start with a number, not with a feeling that something is off. This section measures two objectives on the sample day, and both objectives are illustrative: they are the kind of promise a team would agree with its readers, not targets from any real company. The first is quality: at least ninety-five percent of events pass the rules. The second is freshness: silver is no more than fifteen minutes behind the newest file that landed. The tool measures both from the data itself. Quality: eight of eleven events pass, seventy-two point seven percent, against ninety-five. Breached. Freshness: the newest file landed at nine fifty, and the clock reads ten twenty, so thirty minutes, against fifteen. Breached. Two details keep this honest. The clock is fixed at ten twenty, so the result repeats on every run. And the landing times of the files were set by this step's setup for the example; on the platform they would be the files' real arrival times. The table on the right holds the two measurements. The list says how objectives turn into incidents. Agree the objective with the readers first. Measure it on every run, from the data, not from the job's status. A breach is the alert, even when every task succeeded. And then someone has to know who is told, who fixes it, and by when, which is section ten. Next, recovery, and the harder problem of deleting data.",
}
