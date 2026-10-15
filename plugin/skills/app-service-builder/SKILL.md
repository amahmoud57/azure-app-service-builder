---
name: app-service-builder
description: "Use for explicit App Service Builder requests: prepare builder.yaml, initialize a Builder app from a GitHub repository, deploy pushed source, inspect build/deployment history, or recover a retained version. Requires authorized Private Preview access for development/test. Not for ordinary Azure App Service, Azure Container Apps, or internal platform operations. A generic 'deploy my app' request must first select the product and target."
---

# App Service Builder

Help authorized customers use the `builder` CLI for **Private Preview development/test**, not production. Plugin installation does not grant preview access, install the CLI, qualify a location, or make the service publicly available.

## Before acting

1. Confirm the user means **App Service Builder**. For an ambiguous deployment request, ask which product and target they intend; do not default to Builder or substitute ordinary App Service/Container Apps tooling.
2. Read [prerequisites](references/prerequisites.md). Require an already-installed approved CLI, Node.js >=22, Git, GitHub CLI, authorized subscription, existing resource group, and location/connection settings from the preview contact. **CLI installation is a placeholder.** If anything is missing or unqualified, stop deployment and explain the blocker. Never guess an installer, account, location, endpoint, or access procedure.
3. Read local CLI help and inspect existing account/session context before requesting sign-in. Preserve existing sessions and account context. Keep Microsoft management authentication, GitHub user authorization, GitHub App repository access, and deployed-app sign-in distinct.
4. Establish the exact app name, subscription, resource group, selected GitHub repository, pushed branch/commit, and selected source root. Inspect existing app state when relevant. Do not assume initialization creates a saved local app binding.
5. Explain the target and action before initialization, deployment/rebuild, retained-version activation, or deletion. Honor explicit user scope; ask for approval when scope is missing or ambiguous. Never convert vague requests into resource changes or use bypass flags to approve guessed values.

## Choose the focused workflow

| Task | Read before executing |
| --- | --- |
| Check access, CLI readiness, and source authorization | [Prerequisites and readiness](references/prerequisites.md) |
| Prepare the selected repository's `builder.yaml` | [Source and manifest](references/source-and-manifest.md) |
| Initialize, deploy, and verify the serving app | [Deployment](references/deployment.md) |
| Inspect failures/history, recover, or delete | [Operations](references/operations.md) |

Read the relevant reference in full. All command examples have descriptive placeholders: replace them only with user-confirmed or verified values; never execute angle-bracket values literally. Use `builder --help` and command-specific help to check the installed CLI before using options. Do not invent missing commands.

## Boundaries and completion

- Work from the user's selected GitHub repository and its pushed source. Initialization connects source; it neither deploys nor uploads local changes. No local ZIP upload or native GitHub push-deployment workflow is provided.
- Supported core shapes here are static browser assets or HTTP apps (Node, Python, .NET, PHP 8.5). One static component plus one HTTP backend is a separate combined shape, not a promise of Next.js support.
- Do not provide runnable instructions for unverified preview workflows: Next.js standalone, managed identity/dependent integrations, native GitHub push deployment, runtime log streaming/metrics, scale to zero, custom domains, private networking, persistent mounts, or shell access. There are no current Builder CLI commands for variables, identity, or deployed-app authentication.
- A request accepted by the service, successful build, or operation completion alone is not a serving app. Inspect returned app state and runtime URL, then verify real HTTP behavior and the app-owned health endpoint. Report any unverified stage plainly.
- Do not change cloud access or install plugins globally as part of app work. Keep secrets and confidential diagnostics out of source, responses, and public feedback. For public feedback use sanitized examples; report vulnerabilities privately via the repository's security policy.
