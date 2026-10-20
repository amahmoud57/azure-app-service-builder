# App Service Builder agent plugin

The `builder` plugin provides one customer-facing skill, `app-service-builder`, for authorized App Service Builder **Private Preview development/test** use. It is instructions and focused references only: no hooks, new MCP servers, VS Code extension, or Copilot app canvas.

Plugin distribution does not grant preview access or announce public service availability. It is a repository-hosted marketplace, not admission to a curated plugin directory.

This public repository is the maintained customer skill home. The Builder CLI supplies existing-manifest validation and app operations; it is not a second skill distribution route and does not require a private checkout. Install the customer skill through the marketplace below, not an additional CLI-bundled installer.

## Install the plugin

Use an installed host that supports plugins to install from this repository's marketplace:

### GitHub Copilot CLI

```shell
copilot plugin marketplace add microsoft/azure-app-service-builder
copilot plugin install builder@azure-app-service-builder
copilot plugin list
copilot skill list
```

### Claude Code

```shell
claude plugin marketplace add microsoft/azure-app-service-builder
claude plugin install builder@azure-app-service-builder
claude plugin list
```

Restart the host session after installation if needed. Ask explicitly for App Service Builder, for example: "Check whether my selected repository is ready for App Service Builder; do not deploy." In Claude Code the skill can also be invoked as `/builder:app-service-builder`. Review the target and action before authorizing any cloud change.

These commands install the **agent plugin**, not the **Builder CLI**. They change the host's plugin configuration when the customer chooses to run them.

## Install Builder CLI separately

Obtain the approved portable `azure-builder-cli-<version>.tgz` archive from the [official CLI releases](https://github.com/microsoft/azure-app-service-builder/releases) or your preview contact. The contact supplies preview access and an approved deployment target. Follow the [Builder CLI quickstart](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/). Use the same archive on Windows, Linux, and macOS with Node.js 22 or later, including npm.

Use the CLI release asset, not GitHub's automatic source-code ZIP or tarball. If an approved asset is unavailable, ask the preview contact rather than guessing a version or download URL.

Download the [CLI 0.0.1 preview archive](https://github.com/microsoft/azure-app-service-builder/releases/download/builder-cli-v0.0.1-preview.1/azure-builder-cli-0.0.1.tgz).

Install the downloaded local archive, with the user's approval:

```shell
npm install --global "<path-to-downloaded-file.tgz>"
builder --version
builder --help
```

Replace the path with the actual approved download. Do not extract the archive or install a guessed npm-registry package. npm registry access is still needed for JavaScript dependencies.

The archive includes the portable analyzer, not the .NET runtime. A compatible .NET 10 runtime is required only for local `builder manifest` commands. Login, initialization, and deployment work without .NET. The analyzer's generated `Embr.BuildAnalyzer.runtimeconfig.json` specifies the required runtime; a .NET SDK is not required. An existing compatible SDK includes the runtime.

Before local manifest commands, install the required runtime separately if needed and check:

```shell
dotnet --list-runtimes
```

Local Git and GitHub CLI, an authorized subscription, an existing resource group, and an approved location are also required for deployment. Missing prerequisites stop deployment; the plugin does not install or upgrade tooling automatically. The preview contact supplies access and qualification, not this public repository.

The [canonical product docs](https://builder.appservice.azure.com/docs/) and [current feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) govern support, prerequisites, and limitations. The skill consults maintained docs first, uses bundled procedures, and checks installed CLI help for syntax. Public documentation does not change Private Preview access. Local code/manifest inspection can happen before Git initialization or account connection; cloud actions remain gated on readiness and their own scope.

The [skill](../plugin/skills/app-service-builder/SKILL.md) includes self-contained [readiness](../plugin/skills/app-service-builder/references/prerequisites.md), [source](../plugin/skills/app-service-builder/references/source-and-manifest.md), [deployment](../plugin/skills/app-service-builder/references/deployment.md), and [operations](../plugin/skills/app-service-builder/references/operations.md) references. Unsupported or unqualified workflows must not be inferred from the existence of this plugin.

The CLI validates an existing `builder.yaml` without creating or changing it. Use the manifest guide and selected sample for configuration guidance, and check installed command help before invocation. Local validation is optional and does not block ordinary app setup.

## Package layout and local checks

Both hosts read the same `plugin/skills/` tree. Copilot's entry point is `plugin/plugin.json`; Claude Code's is `plugin/.claude-plugin/plugin.json`. Keep those manifests identical. A single catalog at `.claude-plugin/marketplace.json` is supported by both hosts, so there is no duplicate catalog to drift.

From a checkout, use Node.js >=22 with no package installation:

```shell
node --test scripts/validate-plugin.test.mjs
node scripts/validate-plugin.mjs
```

These offline checks validate the deliberately small manifest schema, required metadata, version agreement, contained relative paths, both entry points, the single skill's frontmatter, local Markdown links, bundled references, canonical product documentation destinations, and approved-archive installation guardrails. Official release-asset links are allowed; other archive sources and automatic source-code downloads are rejected. Link-shape validation does not prove that an asset is published or its checksum matches: verify the actual download before advertising a specific release. Focused safety assertions protect source preservation, read-only reconciliation, CLI commit selection, variable-editing scope, and existing-manifest validation; they are not a semantic safety proof or CLI runtime smoke test. Negative tests exercise broken metadata, paths, references, documentation destinations, unsafe edits, and commands outside the shipped CLI. They do not run `builder`, fetch sample source, validate live doc content/service access, or prove a deployment works.

If Claude Code is already available, `claude plugin validate ./plugin` and `claude plugin validate .` provide additional native manifest validation. Native discovery should be checked using isolated temporary host configuration, not by installing into a contributor's global configuration. Record the host/version and actual result in the PR; missing hosts or live preview checks remain explicit gaps.

Packaging references: [Copilot plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference), [Copilot marketplaces](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace), [Claude marketplaces](https://code.claude.com/docs/en/plugin-marketplaces), and the [Azure Container Apps plugin layout](https://github.com/microsoft/azure-container-apps/tree/main/plugin).

Feedback, support, security reporting, and the repository license remain governed by the [contribution guidance](../CONTRIBUTING.md), [support guidance](../SUPPORT.md), [security policy](../SECURITY.md), and [MIT license](../LICENSE).
