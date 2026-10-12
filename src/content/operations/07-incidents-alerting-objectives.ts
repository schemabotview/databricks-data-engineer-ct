import type { Section } from '../types'

export const incidentsAlertingObjectives: Section = {
  id: 'incidents-alerting-objectives',
  title: 'Incident diagnosis, alerting, freshness, and data-quality objectives',
  scene: 'objectives-alerts',
  focus: 'objective-table',
  slide: `## Alert on a promise, not on every error

**Objective:** state a freshness and a quality objective, and measure each.

**Model:** an **objective** is a promise a consumer cares about, with a threshold. You **measure** it, and **alert** when it is breached. Diagnosis then starts from the evidence, not from a rerun.

### Worked: the Chapter 5 events (measurements are real)
- Freshness objective: newest event under **15 minutes** old. At 10:20 the newest (09:50) is **30 minutes** old: **breached**
- Quality objective: at least **95%** pass the rules. **8 of 11** pass, **72.7%**: **breached**
- The thresholds are illustrative choices

### Alert design
- One alert per objective, naming **who** acts and **what** to check
- A breach opens a **diagnosis**, not an automatic rerun`,
  narration:
    "Chapter one began with what consumers need, and now we can turn that into objectives we can measure. An objective is a promise a consumer cares about, with a threshold. You measure it, and you alert when it is breached. Take two, using the eleven events from chapter five. A freshness objective might say that the newest event must be under fifteen minutes old. I computed it against a fixed clock of ten twenty, so the result is repeatable. The newest event was at nine fifty, so thirty minutes old, and the objective is breached. A quality objective might say that at least ninety five percent of events pass the rules. Eight of the eleven passed, which is seventy two point seven percent, and that is breached too. The thresholds are illustrative choices, but the measurements are real computations. Think about how to alert. Alert on the objective, not on every error, so that one breach produces one alert. Say who is paged and what to check first. And treat a breach as the start of a diagnosis, not as a signal to rerun the job. As chapter eight showed, a blind rerun can duplicate data. Look at the evidence from the last section first, then decide on a repair, a replay or a fix. Next we look at recovery and at deleting data on purpose.",
}
