# Prerequisites and readiness

App Service Builder is a **Private Preview** for **development/test**, not production. A public plugin is not product availability, preview enrollment, or service qualification.

Consult [Private Preview guidance](https://builder.appservice.azure.com/docs/resources/preview/) for access, prerequisites, support, and limitations; check [feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) before recommending a workflow. Verify command syntax against the [CLI reference](https://builder.appservice.azure.com/docs/reference/builder-cli/) and installed help. Report disagreements or unavailable docs rather than guessing or relaxing qualification.

## CLI installation: placeholder

**CLI installation is a placeholder. No TAR URL, npm package name, or installer command is published by this plugin. Do not execute placeholder installation steps.** Use an already-installed approved `builder` CLI. If it is absent, stop deployment and obtain the approved distribution and instructions from the preview contact. Do not download a lookalike package or infer an installation path.

Require local Node.js >=22, Git, and GitHub CLI (`gh`). If a prerequisite is absent or too old, report it and stop deployment rather than installing or upgrading it automatically.

The preview contact must supply authorization for the subscription and the approved location and connection settings. Use an **existing resource group**. This skill does not invent onboarding, regions, endpoints, platform qualifications, or commands for configuring preview connections.

## Manifest capability gate

The manifest workflow described in [source preparation](source-and-manifest.md#cli-owned-manifest-workflow) requires an approved CLI build with that capability. Its availability and OS/CPU package readiness are pending; do not invent a minimum released version or claim universal shipping support. Check `builder --help`, then `builder manifest --help` if listed, and the relevant `propose`, `generate`, `repair`, and `validate` command help before invocation. Verify flags as well as command names. Public docs remain support/availability authority; installed help is command syntax authority. Surface any mismatch rather than proceeding on assumptions.

If commands or flags are absent, explain that this workflow needs an approved capable CLI build and stop manifest generation/repair. Read-only app/sample inspection can still help; do not bypass deterministic rendering with hand-written YAML or a replacement framework detector. The native repository analyzer is supplied with a capable CLI on supported OS/CPU combinations; it does not require customer .NET or a separately installed analyzer. Missing native prerequisites/errors must be reported, not solved with guessed installers.

Proposal, rendering previews, repair previews, and plan validation are local. Only optional build validation executes repository build scripts; it needs separate execution approval. Neither mode proves preview runtime qualification or hosted success.

## Read-only readiness checks

Local code and manifest inspection does not require Git initialization, sign-in, or a source connection. Do not create a repository or connect accounts just to read files. For cloud work, inspect local tooling and account state in the deliberately selected checkout:

```shell
node --version
git --version
gh --version
builder --help
builder account show
builder doctor --help
builder doctor --json
```

The intended/selected account, verified identity, and actual target access are different checks. Do not request sign-in if the existing context is already correct. Preserve machine-wide account configuration: do not silently switch global CLI accounts or reuse another account's credential. Do not change tenants, subscriptions, or connections silently. If the confirmed management context needs authentication, consult help and use:

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

Keep credentials out of chat, manifests, remote URLs, and logs. Inspect only credential-free repository origins; do not display a token-bearing origin or copy it into a command. An account selection or successful login alone is not evidence of repository access.

Microsoft management sign-in and GitHub source access do not configure authentication for visitors to the deployed app. There is no current Builder CLI command for deployed-app authentication.

Proceed only when the exact target, approved connection settings, account context, source access, and CLI diagnostics are ready. Never treat a missing prerequisite as a successful readiness check.
