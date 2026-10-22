import type { Section } from '../types'

export const modularCode: Section = {
  id: 'modular-code',
  title: 'Modular code',
  scene: 'operate-modules',
  narration:
    "The last part of the course is about shipping the project and running it for real. It starts with where code lives. Everything the pipeline does is in the package, source retail, and this section adds one more module to it: jobs, the editor's file. It holds the job's entry points, one per task of the job from course ten. Each is a few lines. Ingest builds a session and calls bronze ingest. Transform calls silver build. Validate reads three counts and stops the run if silver and quarantine hold more rows than bronze received. Publish calls gold build. They contain no logic of their own; the logic is in the modules every lesson has used. The terminal shows the boundary between local and remote. Listing the package shows its modules. Then a search for the three things that make a session local: the local master, the Hive metastore, and Delta's pip helper. All four matches are in one file, session dot py. On Databricks, the runtime provides the session, so that one file is the only thing that differs. The table on the right says where each kind of code lives. The logic in the package, which runs everywhere. The job's steps in jobs, which run as wheel tasks. Exploration in notebooks, and lessons and checks in tools, which are run by hand. One more change, highlighted in the explorer: silver's choice of the latest row is now its own function, latest, so the tests in section three can test it alone. Next, packaging the code as a wheel.",
}
