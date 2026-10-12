import type { Section } from '../types'

export const checkpointsRestartsChanges: Section = {
  id: 'checkpoints-restarts-changes',
  title: 'Checkpoints, restarts, and compatible query changes',
  scene: 'restart-changes',
  focus: 'restart-trace',
  slide: `## A checkpoint ties a query to its state

**Objective:** predict what happens when a query is restarted, or changed, on its old checkpoint.

**Model:** the checkpoint holds offsets and **state**. A restarted query resumes from it. A changed query is accepted only if the state still fits, and **fit is checked by schema, not by meaning**.

### Worked: one checkpoint, four runs (local run)
- Same query, two new files: **resumes at batch 3**; nothing re-read
- An added stateless **filter**: accepted
- Window **10 to 5 minutes**: accepted, **no error**
- A new grouping key, \`store_id\`: **refused**, \`STATE_STORE_KEY_SCHEMA_NOT_COMPATIBLE\`

### Rule
- No error is not the same as no problem: re-check any change that touches state`,
  narration:
    "The checkpoint is what lets a streaming query survive a restart, and it also binds the query to its state. If you restart the same query, it resumes from the checkpoint. In a local run, I ran a windowed sum over two files, stopped, added two more files, and started the same query again with the same checkpoint. It resumed at batch three and processed only the new files. Nothing was read twice. Now suppose you change the query, which will happen. I tried three changes on the same checkpoint. Adding a stateless filter was accepted. Changing the window from ten minutes to five minutes was also accepted, with no error at all. And adding store id as a grouping key was refused, with a state store key schema not compatible error, because the stored state no longer fits. The middle one is the instructive result. The checkpoint checks that the state's schema still matches. It does not check that the old state still means what the new query assumes. The window change passed because the types matched, not because the change was safe. So the rule is that no error is not the same as no problem. Any change that touches state needs thought, and often a new checkpoint with a deliberate backfill. Next we look at what a restart can do to the sink.",
}
