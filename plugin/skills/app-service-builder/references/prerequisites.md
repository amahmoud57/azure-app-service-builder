# Prerequisites and readiness

App Service Builder is a **Private Preview** for **development/test**, not production. A public plugin is not product availability, preview enrollment, or service qualification.

Consult [Private Preview guidance](https://builder.appservice.azure.com/docs/resources/preview/) for access, prerequisites, support, and limitations; check [feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) before recommending a workflow. Verify command syntax against the [CLI reference](https://builder.appservice.azure.com/docs/reference/builder-cli/) and installed help. Report disagreements or unavailable docs rather than guessing or relaxing qualification.

## Install Builder CLI

Use an already-installed approved `builder` CLI when available. Otherwise obtain the approved portable `azure-builder-cli-<version>.tgz` archive from the [official CLI releases](https://github.com/microsoft/azure-app-service-builder/releases) or the preview contact and follow the [Builder CLI quickstart](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/). Use the same archive on Windows, Linux, and macOS with Node.js 22 or later, including npm.

Use the CLI release asset and its published SHA-256 checksum, not GitHub's automatic source-code ZIP or tarball. Compute and compare the local archive's hash before installing it. If an approved asset or trusted checksum is unavailable, ask the preview contact; do not guess a version or download URL.

The CLI 0.0.1 preview assets are the [portable CLI archive](https://github.com/microsoft/azure-app-service-builder/releases/download/builder-cli-v0.0.1-preview.1/azure-builder-cli-0.0.1.tgz) and its [SHA-256 checksum](https://github.com/microsoft/azure-app-service-builder/releases/download/builder-cli-v0.0.1-preview.1/azure-builder-cli-0.0.1.tgz.sha256).

After approval to install the downloaded archive:

```shell
npm install --global "<path-to-downloaded-file.tgz>"
builder --version
builder --help
```

Use the actual approved local file, not the placeholder path. Do not extract the archive, guess a registry package or download URL, or install/upgrade tooling automatically. npm still needs registry access for JavaScript dependencies.

A compatible .NET 10 runtime is required only for local `builder manifest` commands. Login, initialization, and deployment work without .NET. The analyzer is included in the archive and does not require a separate installation. Its generated `Embr.BuildAnalyzer.runtimeconfig.json` specifies the runtime requirement; a .NET SDK is not required.

Before local manifest commands, keep the compatible runtime on PATH and inspect:

```shell
dotnet --list-runtimes
```

If the runtime is missing or incompatible, report the actual requirement and stop that local command rather than automatically installing a runtime or a different analyzer. This does not block ordinary CLI login, setup, or deployment.

Require local Git and GitHub CLI (`gh`) for source operations. If deployment prerequisites are absent or too old, report them and stop deployment rather than installing or upgrading them automatically.

The preview contact must supply authorization for the subscription and the approved location and connection settings. Use an **existing resource group**. This skill does not invent onboarding, regions, endpoints, platform qualifications, or commands for configuring preview connections.

## Local manifest validation

Check `builder --help`, then `builder manifest --help`, and the relevant command help before invocation. The CLI checks an existing `builder.yaml`; it does not create or modify it. Inspect `builder manifest validate --help` for the supported path argument, `--json`, and optional `--build`.

If validation or a flag is unavailable, report the installed CLI limitation rather than inventing a replacement command. Local validation is optional; it is not a prerequisite for app setup. See [manifest validation](source-and-manifest.md#validate-builderyaml) for the existing-file workflow.

Public docs remain support/availability authority; installed help is command syntax authority. Surface any mismatch rather than proceeding on assumptions.

Validation is local and read-only. Only optional build validation executes repository build scripts; it needs separate execution approval. Neither mode proves preview runtime qualification or hosted success.

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
