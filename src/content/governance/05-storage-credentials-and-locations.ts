import type { Section } from '../types'

export const storageCredentialsAndLocations: Section = {
  id: 'storage-credentials-and-locations',
  title: 'Storage credentials, external locations, and cloud permission boundaries',
  scene: 'storage-boundaries',
  focus: 'external-location',
  slide: `## Three controls, three yeses

**Objective:** for one operation, say which identity and which boundary decided the outcome.

**Model:** the **workspace**, **Unity Catalog** and the **cloud** each check access separately. A **storage credential** wraps a cloud IAM role; an **external location** pairs it with a path.

### Worked: reading the partner feed (documented, not run)
- Workspace: can this user open and run the notebook?
- Unity Catalog: does the user hold \`READ FILES\` on \`partner_feed\`?
- Cloud: can the IAM role behind the credential reach that S3 path?
- Any one **no** stops the read

### Setup, once
- A credential comes from an IAM role; each location needs its own grants

### Misconception
- **"Grants alone are enough."** A role without bucket access fails even with every grant`,
  narration:
    "So far, permissions have lived inside Unity Catalog. But the files themselves live in cloud storage, and the cloud has its own rules. A single read can pass through three separate controls, and any one of them can say no. The workspace decides who may open and run things. Unity Catalog decides who may read which objects. And the cloud's own identity system decides what the underlying role can actually reach. The bridge between Unity Catalog and the cloud has two parts. A storage credential wraps a cloud IAM role, and it is typically created in Catalog Explorer or through the API. An external location pairs that credential with a specific path. Our example creates an external location called partner feed, pointing at a fictional S3 path, using a credential called partner role. Then we grant read files on it to the data engineers. Now trace a read of the partner feed. Is the user allowed into the workspace? Does the user hold read files on the location? Can the IAM role behind the credential reach that path? Any single no stops the read, and the error you see depends on which control refused. The setup is done once. The credential is created from an IAM role, and each external location names the path it covers and needs its own grants. The misconception here is that grants alone are enough. If the IAM role has no access to the bucket, the read fails even when every Unity Catalog grant is perfect. That is why we explain the three controls separately. This example is documented, not run, and requires cloud-side setup. Next we see how to find and trace governed data.",
}
