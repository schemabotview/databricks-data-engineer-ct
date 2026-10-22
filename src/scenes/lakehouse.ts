// retail-lakehouse's files as Course 3 leaves them, for projectTree() (./project.ts). Each later course
// adds its own paths. `~` marks what a run generated: Spark's warehouse, the local metastore.
export const START_FILES = [
  'conf/log4j2.properties', 'conf/spark-defaults.conf', '~metastore_db/', 'notebooks/explore.py', '~spark-warehouse/',
  'src/retail/__init__.py', 'src/retail/session.py', 'tools/load_sample.py', 'tools/first_query.py',
  '.gitignore', '~derby.log', 'pyproject.toml', 'requirements.txt',
]

// Course 4 adds the drop demo, the grants and their model.
export const GOVERN_FILES = [...START_FILES, '~data/external/', 'tools/drop_demo.py', 'governance/grants.sql', 'tools/grant_matrix.py']

// Course 5's lab scripts, in the order its sections add them, and the error helper they share.
export const DELTA_LABS = ['versions', 'conflict', 'contract', 'changes', 'history', 'vacuum', 'change_feed', 'features']
export const tablesFiles = (upTo: number) => [...GOVERN_FILES, 'src/retail/errors.py', ...DELTA_LABS.slice(0, upTo).map((f) => `tools/delta/${f}.py`)]

// Course 6's files, by the section that adds them; `~` again marks what a run writes.
const INGEST_BY_SECTION: Record<number, string[]> = {
  2: ['data/samples/orders-a.csv', 'data/samples/orders-b.csv', 'data/samples/orders-c.csv', 'tools/ingest/batch_twice.py'],
  4: ['src/retail/bronze.py', 'tools/ingest/arrival.py', '~data/landing/', '~checkpoints/'],
  5: ['data/samples/drift/1.json', 'data/samples/drift/2.json', 'tools/ingest/drift.py'],
  6: ['tools/ingest/malformed.py'],
  9: ['tools/ingest/reconcile.py'],
}
export const ingestFiles = (upTo: number) => [
  ...tablesFiles(DELTA_LABS.length),
  ...Object.entries(INGEST_BY_SECTION).filter(([n]) => Number(n) <= upTo).flatMap(([, files]) => files),
]

// Course 7's files, by the section that adds them.
const TRANSFORM_BY_SECTION: Record<number, string[]> = {
  1: ['data/samples/orders-d.csv', 'tools/transform/lazy.py'],
  2: ['tools/transform/same_plan.py'],
  3: ['tools/transform/types_and_time.py'],
  4: ['data/reference/stores.csv', 'tools/transform/join_check.py'],
  5: ['tools/transform/latest.py'],
  6: ['src/retail/quality.py', 'src/retail/silver.py', 'tools/transform/quality_check.py'],
  7: ['src/retail/gold.py', 'tools/transform/gold_contract.py'],
  8: ['src/retail/run.py'],
}
export const transformFiles = (upTo: number) => [
  ...ingestFiles(9),
  ...Object.entries(TRANSFORM_BY_SECTION).filter(([n]) => Number(n) <= upTo).flatMap(([, files]) => files),
]

// Course 8's files, by the section that adds them.
const CHANGES_BY_SECTION: Record<number, string[]> = {
  1: ['data/samples/stream/orders/', 'tools/changes/feed.py', 'tools/changes/incremental.py'],
  2: ['tools/changes/watermarks.py'],
  3: ['tools/changes/state.py'],
  4: ['data/samples/stream/payments/', 'tools/changes/joins.py'],
  5: ['tools/changes/restarts.py'],
  6: ['tools/changes/sinks.py'],
  7: ['data/samples/cdc/', 'src/retail/cdc.py', 'tools/changes/cdc_apply.py'],
  8: ['tools/changes/scd.py'],
  9: ['tools/changes/cdf_vs_cdc.py'],
  10: ['tools/changes/recovery.py'],
}
export const changesFiles = (upTo: number) => [
  ...transformFiles(8),
  ...Object.entries(CHANGES_BY_SECTION).filter(([n]) => Number(n) <= upTo).flatMap(([, files]) => files),
]

// Course 9's files, by the section that adds them.
const PIPELINES_BY_SECTION: Record<number, string[]> = {
  1: ['pipelines/retail.py'],
  3: ['resources/retail_pipeline.yml'],
  4: ['tools/pipelines/policies.py'],
  5: ['tools/pipelines/source_update.py'],
}
export const pipelinesFiles = (upTo: number) => [
  ...changesFiles(10),
  ...Object.entries(PIPELINES_BY_SECTION).filter(([n]) => Number(n) <= upTo).flatMap(([, files]) => files),
]

// Course 10's files, by the section that adds them.
const SCHEDULE_BY_SECTION: Record<number, string[]> = {
  1: ['resources/retail_daily.yml'],
  2: ['tools/schedule/jobs.py', 'tools/schedule/tasks.py', 'tools/schedule/params.py'],
  4: ['tools/schedule/failure.py'],
  5: ['tools/schedule/repair.py'],
  6: ['tools/schedule/run_as.py'],
  7: ['tools/schedule/daily.py'],
}
export const scheduleFiles = (upTo: number) => [
  ...pipelinesFiles(8),
  ...Object.entries(SCHEDULE_BY_SECTION).filter(([n]) => Number(n) <= upTo).flatMap(([, files]) => files),
]
