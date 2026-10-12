import type { Section } from '../types'

export const accountsWorkspacesBoundaries: Section = {
  id: 'accounts-workspaces-boundaries',
  title: 'Accounts, workspaces, storage, and execution boundaries',
  scene: 'platform-boundaries',
  focus: 'object-storage',
  slide: `## Where code runs and where data lives

**Objective:** locate the account, workspace, compute and storage behind any operation.

**Model:** an **account** holds **workspaces**; a workspace is where people work. **Compute** runs the code. **Storage** holds the data. Each has its own owner and its own lifetime.

### Worked: following one query
- You open a notebook in the **prod** workspace
- The code runs on **compute**: serverless (Databricks-managed) or classic (in your cloud account)
- It reads Delta files from **object storage** in your cloud account, here S3
- When the compute stops, the files are still there

### Misconceptions
- **"A workspace is a database."** It holds notebooks, jobs and settings; governed data objects come next, in Chapter 2
- **"Resizing compute moves data."** It never touches the files`,
  narration:
    "Now let's place those pieces on a map, because the same operation touches several boundaries and each one has a different owner. At the top is the Databricks account. An account holds one or more workspaces, for example a dev workspace and a prod workspace. A workspace is the place where people work: it holds notebooks, jobs and settings. Code does not run inside the workspace page itself. It runs on compute, and compute comes in two placements. Serverless compute is managed by Databricks. Classic compute runs in your own cloud account. The data lives somewhere else again, in object storage in your cloud account, which on AWS means S3. Follow a single query to see how these fit. You open a notebook in the prod workspace and run a cell. The code runs on compute. The compute reads Delta files from object storage and returns a result. When the compute stops, the files are still exactly where they were, because storage outlives every cluster. Two misconceptions are worth naming. A workspace is not a database. It holds your notebooks and jobs, and the governed data objects are handled separately, which is the subject of the next chapter. And resizing or restarting compute never moves or deletes data. Keeping storage and compute apart in your head is what lets you reason about cost, failure and access later. Next we compare the compute choices themselves.",
}
