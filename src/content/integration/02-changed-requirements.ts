import type { Section } from '../types'

export const changedRequirements: Section = {
  id: 'changed-requirements',
  title: 'Changed requirements: latency, scale, new sources, and historical corrections',
  scene: 'changed-requirements',
  focus: 'change-table',
  slide: `## Change the requirement, keep the evidence

**Objective:** apply a requirement change to the design and show the results still reconcile.

**Model:** a sound design absorbs change in **one place**: a correction becomes a later event, a new source maps onto the common shape, a faster refresh applies the same logic in increments.

### Worked: three changes (local run)
- **Correction:** o4 becomes 18.00 in a later file; York **18.00**, total **173.00**; history keeps **both** versions
- **New source:** partner orders with store **codes**; **2 of 3** map, the unknown code is quarantined; total **215.00**
- **Faster refresh:** three micro-batches with a guarded merge **equal** the full recompute

### Why it held
- A correction is a **later event**, not an edit in place
- A new source is **mapped**, not special-cased

### Reconciliation
- **15** input rows = **8** silver + **3** older versions + **4** quarantined`,
  narration:
    "Requirements will change, and a good design absorbs a change in one place, with evidence that it still reconciles. I applied three changes to the same retail design in a local run, reusing the real example package. The first is a historical correction. A later file says that order four was actually eighteen dollars, not fifteen. In the design, a correction is just a later event, so the latest event wins. York becomes eighteen dollars, and the total becomes one hundred seventy three. The history keeps both versions of order four, the fifteen dollar version closed by the eighteen dollar one. The second change is a new source. A partner sends orders with store codes instead of store ids, and one of the codes is unknown. We map the codes onto the common shape and let the quality rules reject what does not map. Two of the three partner orders load, the third is quarantined, and the total becomes two hundred fifteen. The third change is latency. I applied the same logic as three micro batches, each a merge guarded by a sequence, and the result was identical to the full recompute. The design held because a correction is a later event and not an edit in place, and a new source is mapped and not special cased. Finally, reconcile. Fifteen input rows equal eight silver orders, plus three older versions, plus four quarantined rows. Next we compare the ways of building this.",
}
