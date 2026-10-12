import type { Scene } from '@graphlearning/flow'
import { requirementsMatrix } from './requirements-matrix'
import { lakehouseStack } from './lakehouse-stack'
import { platformBoundaries } from './platform-boundaries'
import { computeChoice } from './compute-choice'
import { firstQuery } from './first-query'
import { layeredProducts } from './layered-products'

// One bundle per course folder, spread into src/scenes/index.ts.
export const foundationsScenes: Scene[] = [
  requirementsMatrix,
  lakehouseStack,
  platformBoundaries,
  computeChoice,
  firstQuery,
  layeredProducts,
]
