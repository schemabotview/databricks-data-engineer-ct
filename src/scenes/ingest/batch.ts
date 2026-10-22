import type { Scene } from '@graphlearning/flow'
import { ingestFrame } from './frame'
import code from '../../../spine/ingest/02-batch-twice/project/tools/ingest/batch_twice.py?raw'
import raw from '../../../spine/ingest/02-batch-twice/session.txt?raw'

// A plain append, run twice: 8 then 16 rows, still 7 order ids — a real run (spine/ingest/02). COPY
// INTO is DOCUMENTED (it skips files it already loaded), not run.
export const batch: Scene = ingestFrame('batch-load', 2, 'tools/ingest/batch_twice.py', { code, highlight: [10, 11], terminal: raw }, ['data/samples', 'tools/ingest/batch_twice.py'], {
  id: 'batch-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'copy-into',
      kind: 'list',
      icon: 'code',
      label: 'COPY INTO, documented (not run)',
      pattern: 'network',
      items: [
        'COPY INTO retail.bronze.orders',
        "FROM '/Volumes/retail/bronze/landing/orders/'",
        'FILEFORMAT = CSV',
        "FORMAT_OPTIONS ('header' = 'true')",
      ],
    },
    {
      id: 'batch-facts',
      kind: 'list',
      icon: 'copy',
      label: 'Repeat-safe, or not',
      pattern: 'warn',
      items: [
        'An append remembers nothing: twice is 16',
        'COPY INTO remembers each file it loaded',
        'So a second COPY INTO loads 0 new files',
        'It knows paths: a corrected file must be forced',
      ],
    },
  ],
})
