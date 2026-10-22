import type { Course } from '../types'
import { theSparkYouNeed } from './01-the-spark-you-need'
import { sqlAndDataframes } from './02-sql-and-dataframes'
import { typesNullsAndTime } from './03-types-nulls-and-time'
import { joinsAndCardinality } from './04-joins-and-cardinality'
import { windowsAndDeduplication } from './05-windows-and-deduplication'
import { qualityRulesAndQuarantine } from './06-quality-rules-and-quarantine'
import { goldAsAContract } from './07-gold-as-a-contract'
import { theSilverAndGoldFlow } from './08-the-silver-and-gold-flow'

export const transform: Course = {
  id: 'transform',
  title: 'Build silver and gold',
  sections: [theSparkYouNeed, sqlAndDataframes, typesNullsAndTime, joinsAndCardinality, windowsAndDeduplication, qualityRulesAndQuarantine, goldAsAContract, theSilverAndGoldFlow],
}
