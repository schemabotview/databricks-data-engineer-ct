import type { Section } from '../types'

export const librariesWheelsEnvironments: Section = {
  id: 'libraries-wheels-environments',
  title: 'Libraries, environments, wheels, runtime compatibility, and dependency isolation',
  scene: 'wheel-environments',
  focus: 'dependency-table',
  slide: `## Package it, and leave out what the runtime owns

**Objective:** say what goes in a wheel, what must not, and how to keep versions compatible.

**Model:** a **wheel** is a built package a job can install. It should declare only the dependencies **your code** needs. Spark comes from the **runtime**, so pinning it in the wheel can fight the runtime's own version.

### Worked: a real build
- \`retail_etl-0.1.0-py3-none-any.whl\` holds \`transform.py\` and an entry point
- Its metadata requires **no pyspark**; \`pytest\` appears only as a **test extra**
- Locally, a venv with \`pyspark==4.0.1\` provides Spark instead

### Compatibility (documented)
- Test on the **runtime version** you deploy to
- Pin what only your code uses; isolate jobs so one cannot break another`,
  narration:
    "Once the code is in a package, the next question is what to put in it. A wheel is a built Python package that a job can install. The most important rule is to declare only the dependencies that your code needs, and to leave out what the runtime already provides. Spark is provided by the runtime, so pinning it in your wheel can fight with the version that the runtime brings. I built the example project's wheel locally with pip, so this is real. The file is called retail etl, version zero point one point zero, and it contains the transform module and an entry point. Its metadata lists no dependency on pyspark. The only requirement it names is pytest, and only as an extra for testing, which is not installed in production. Locally, my virtual environment provides pyspark, pinned to the version I tested with. On a workspace, the runtime provides it. The compatibility habits are documented, not run. Test on the runtime version you deploy to, because a library that works on one runtime can break on another. Pin what only your code uses. And isolate the environments of different jobs, so that an upgrade for one cannot break another. Next we look at tests.",
}
