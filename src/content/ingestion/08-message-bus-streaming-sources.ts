import type { Section } from '../types'

export const messageBusStreamingSources: Section = {
  id: 'message-bus-streaming-sources',
  title: 'Message-bus and streaming-source ingestion: offsets and operational assumptions',
  scene: 'message-bus',
  focus: 'offset-table',
  slide: `## Resume position and retention

**Objective:** say what a stream needs to resume, and what can make a replay impossible.

**Model:** every incremental source has a **position**: files seen, partition **offsets** for a message bus, a log position for a database. The checkpoint stores it. The source's **retention** limits how far back a replay can go.

### Worked: three sources (documented, not run)
- Files: position is the files seen; replay needs the files kept
- Message bus: offsets per partition; replay needs the topic retained
- Database log: a log position; replay needs the log retained

### Assumptions to state
- Offsets live in **your** checkpoint
- Expired data **cannot be replayed**
- Delivery guarantees depend on the source **and** the sink`,
  narration:
    "Files are one kind of source. Others are streams of messages, such as a message bus, or the change log of a database. They all share one idea. To resume, the pipeline needs a position: for files, the files already seen. For a message bus, an offset for each partition. For a database log, a position in the log. That position is stored in your checkpoint. The second shared idea is retention. A source only keeps data for so long, and that limits how far back a replay can go. This board is documented, not run, since I had no message broker. The code is the standard shape of a Kafka read. It names a source, a topic to subscribe to, and a starting offset of earliest, which means begin from the oldest retained message. The broker settings are placeholders. Now the assumptions to state out loud. Offsets live in your checkpoint, so losing the checkpoint loses your place, as we saw in the file example. If the source's retention expires before you read the data, it cannot be replayed. And delivery guarantees depend on both the source and the sink, so never say a pipeline is exactly once without naming which pair you mean. Next we put these ideas together in a first bronze table.",
}
