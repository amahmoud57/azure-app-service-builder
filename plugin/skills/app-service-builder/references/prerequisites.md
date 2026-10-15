# Prerequisites and readiness

App Service Builder is a **Private Preview** for **development/test**, not production. A public plugin is not product availability, preview enrollment, or service qualification.

## CLI installation: placeholder

**CLI installation is a placeholder. No TAR URL, npm package name, or installer command is published by this plugin. Do not execute placeholder installation steps.** Use an already-installed approved `builder` CLI. If it is absent, stop deployment and obtain the approved distribution and instructions from the preview contact. Do not download a lookalike package or infer an installation path.

Require local Node.js >=22, Git, and GitHub CLI (`gh`). If a prerequisite is absent or too old, report it and stop deployment rather than installing or upgrading it automatically.

The preview contact must supply authorization for the subscription and the approved location and connection settings. Use an **existing resource group**. This skill does not invent onboarding, regions, endpoints, platform qualifications, or commands for configuring preview connections.

## Read-only readiness checks

From the selected source repository, inspect local tooling and account state first:

```shell
node --version
git --version
gh --version
builder --help
builder account show
builder doctor --help
builder doctor --json
```

Do not request sign-in if the existing context is already correct. Do not switch accounts, tenants, subscriptions, or connections silently. If the confirmed management context needs authentication, consult help and use:

```shell
builder login --tenant "<tenant-id>"
```

`builder login` without a tenant selector is also available; choose only with the user's intended tenant established. Recheck `builder account show` afterward.

## Source authorization is separate

Inspect `gh auth status` and the selected repository's access without exposing credentials. When Builder source authorization is needed, consult help and use:

```shell
builder source login github
```

GitHub user authorization does not prove that the GitHub App installation can access the selected repository. Confirm that access separately through the approved preview flow. Stop if access is missing; do not change repository permissions or install a GitHub App automatically.

Microsoft management sign-in and GitHub source access do not configure authentication for visitors to the deployed app. There is no current Builder CLI command for deployed-app authentication.

Proceed only when the exact target, approved connection settings, account context, source access, and CLI diagnostics are ready. Never treat a missing prerequisite as a successful readiness check.
