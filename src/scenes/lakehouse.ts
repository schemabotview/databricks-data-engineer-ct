// retail-lakehouse's files as Course 3 leaves them, for projectTree() (./project.ts). Each later course
// adds its own paths. `~` marks what a run generated: Spark's warehouse, the local metastore.
export const START_FILES = [
  'conf/log4j2.properties', 'conf/spark-defaults.conf', '~metastore_db/', 'notebooks/explore.py', '~spark-warehouse/',
  'src/retail/__init__.py', 'src/retail/session.py', 'tools/load_sample.py', 'tools/first_query.py',
  '.gitignore', '~derby.log', 'pyproject.toml', 'requirements.txt',
]
