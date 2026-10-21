import type { Course } from '../types'
import { whatADataProductOwes } from './01-what-a-data-product-owes'
import { sparkDeltaDatabricks } from './02-spark-delta-databricks'
import { theLakehouse } from './03-the-lakehouse'
import { bronzeSilverGold } from './04-bronze-silver-gold'
import { whatWeWillBuild } from './05-what-we-will-build'

export const whyDatabricks: Course = {
  id: 'why-databricks',
  title: 'Why a platform',
  sections: [whatADataProductOwes, sparkDeltaDatabricks, theLakehouse, bronzeSilverGold, whatWeWillBuild],
}
