---
name: app-service-builder
description: "Use for explicit App Service Builder requests: prepare builder.yaml, initialize a Builder app from a GitHub repository, deploy pushed source, inspect build/deployment history, or recover a retained version. Requires authorized Private Preview access for development/test. Not for ordinary Azure App Service, Azure Container Apps, or internal platform operations. A generic 'deploy my app' request must first select the product and target."
---

# App Service Builder

Help authorized customers use the `builder` CLI for **Private Preview development/test**, not production. Plugin installation does not grant preview access, install the CLI, qualify a location, or make the service publicly available.

This public repository is the maintained customer skill home; the CLI supplies executable manifest analysis/rendering/validation, not a second skill installation route. No private checkout is required.

## Before acting

Use the [canonical product documentation](https://builder.appservice.azure.com/docs/) and check [current feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) before recommending a workflow. Maintained docs govern support, prerequisites, and limitations; bundled references provide procedure; installed CLI help verifies actual syntax. If docs and help disagree, surface the mismatch and do not guess. If docs cannot be fetched, disclose the gap and do not promote unqualified features. Public docs do not make the platform publicly available.

1. Confirm the user means **App Service Builder**. For an ambiguous deployment request, ask which product and target they intend; do not default to Builder or substitute ordinary App Service/Container Apps tooling.
2. Local code/manifest inspection can precede Git initialization or account connection. Before cloud work, read [prerequisites](references/prerequisites.md): require an already-installed approved CLI, Node.js >=22, Git, GitHub CLI, authorized subscription, existing resource group, and approved location/connection settings. **CLI installation is a placeholder.** Missing or unqualified prerequisites stop deployment; never guess installers or access settings.
3. Read local CLI help and inspect existing account/session context before requesting sign-in. Preserve existing sessions and account context. Keep Microsoft management authentication, GitHub user authorization, GitHub App repository access, and deployed-app sign-in distinct.
4. Before publication/deployment, bind the exact app, subscription/resource group, repository identity, branch, source attachment root, and deliberately selected checkout. Preserve dirty/unrelated work; reconcile actual source/account state rather than inferring readiness from a local preview or sample.
5. Scope each write to the confirmed target and requested action. Plan approval, local preview, source publication, cloud deployment, retained recovery, and deletion are distinct permissions, not blanket approval. Ask only when needed to resolve scope; do not use bypass flags to approve guessed values. Reconcile unknown write outcomes read-only before retrying.

## Choose the focused workflow

| Task | Read before executing |
| --- | --- |
| Check access, CLI readiness, and source authorization | [Prerequisites and readiness](references/prerequisites.md) |
| Prepare app layout using optional samples; capability-check CLI manifest proposal, rendering, repair, and validation | [Source and manifest](references/source-and-manifest.md) |
| Initialize, deploy, and verify the serving app | [Deployment](references/deployment.md) |
| Inspect failures/history, recover, or delete | [Operations](references/operations.md) |

Read the relevant reference in full. All command examples have descriptive placeholders: replace them only with user-confirmed or verified values; never execute angle-bracket values literally. Use `builder --help` and command-specific help to check the installed CLI before using options. Do not invent missing commands.

For a starting point, detect the existing framework/runtime and static versus HTTP shape first. Use the [published sample catalog](https://builder.appservice.azure.com/docs/samples/) for context and the verified public examples in the source reference; inspect the selected sample's current README, root `builder.yaml`, and relevant project/startup/health files before proposing small adaptations. Preserve existing source instead of requiring a fork. Source examples do not override current availability warnings.

Before manifest commands, check installed help for the capability; distribution readiness is pending, not universal. The CLI renders and validates the actual manifest: do not hand-write YAML or implement a replacement detector if that capability is absent. Read proposal/repair JSON, preview the exact output/diff, and obtain approval before writes or build execution.

## Boundaries and completion

- Work from the user's selected GitHub repository and pushed source; samples are optional. Provisioning, source connection, and deployment are separate effects. `init` is setup, not a local upload or explicit deploy; source changes may trigger configured automation where enabled. Preserve partial success and retry only the missing step.
- Static browser assets and qualified HTTP apps are the core focus. Runtime recognition is not version/target qualification; current feature status takes precedence over bundled examples. Combined output and Next.js require separate confirmation.
- Do not provide runnable instructions for unverified preview workflows: Next.js standalone, managed identity/dependent integrations, native GitHub push deployment, runtime log streaming/metrics, scale to zero, custom domains, private networking, persistent mounts, or shell access. There are no current Builder CLI commands for variables, identity, or deployed-app authentication.
- A request accepted by the service, successful build, or operation completion alone is not a serving app. Inspect returned app state and runtime URL, then verify real HTTP behavior and the app-owned health endpoint. Report any unverified stage plainly.
- Do not change cloud access or install plugins globally as part of app work. Keep secrets and confidential diagnostics out of source, responses, and public feedback. For public feedback use sanitized examples; report vulnerabilities privately via the repository's security policy.
