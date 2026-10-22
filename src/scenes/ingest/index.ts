import type { Scene } from '@graphlearning/flow'
import { contracts } from './contracts'
import { batch } from './batch'
import { autoloader } from './autoloader'
import { arrival } from './arrival'
import { drift } from './drift'
import { malformed } from './malformed'
import { connectors } from './connectors'
import { messagebus } from './messagebus'
import { reconcile } from './reconcile'

export const ingestScenes: Scene[] = [contracts, batch, autoloader, arrival, drift, malformed, connectors, messagebus, reconcile]
