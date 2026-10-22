import type { Section } from '../types'

export const wheelsAndEnvironments: Section = {
  id: 'wheels-and-environments',
  title: 'Wheels and environments',
  scene: 'operate-wheel',
  narration:
    "A job on Databricks runs code from a wheel, a Python package built as one file. The editor shows what describes it, the project file. Its dependencies are empty, on purpose: Spark and Delta come from the runtime, and locally from the requirements file. Pytest is an optional extra, for testing only. And the scripts section names the five entry points from the last section, ingest, transform, validate, publish and alert, which the job's wheel tasks call by name. The terminal builds the wheel for real, with pip, and then the tool reads what is inside it. The wheel is retail lakehouse, version nought point one. Its code is the package's modules. It requires nothing, except pytest with the test extra. It does not require PySpark or Delta. And it declares the five entry points. The table on the right splits what comes from the wheel from what comes from the runtime. The modules and entry points come from the wheel. Pytest only with the extra. PySpark, Delta, Python and Java from the runtime. The list explains why that split matters. A wheel that declared PySpark could install a second copy, which would fight the one the runtime already provides. So the wheel carries only our code, and the versions we test against locally should match the runtime's, which course two showed how to read. Next, the tests that run before any of this is deployed.",
}
