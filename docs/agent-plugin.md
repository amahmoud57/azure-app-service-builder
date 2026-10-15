# App Service Builder agent plugin

The `builder` plugin provides one customer-facing skill, `app-service-builder`, for authorized App Service Builder **Private Preview development/test** use. It is instructions and focused references only: no hooks, new MCP servers, VS Code extension, or Copilot app canvas.

Plugin distribution does not grant preview access or announce public service availability. It is a repository-hosted marketplace, not admission to a curated plugin directory.

## Install the plugin

Use an installed host that supports plugins. The following repository-based commands work once this package is merged into the repository's default branch; a draft PR is not a published marketplace release.

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

## Builder CLI installation: placeholder

**CLI installation is a placeholder.** No TAR download URL, npm package name, or installer command is provided yet. Do not run a placeholder or install a guessed package. Use an already-installed approved `builder` CLI; otherwise obtain the approved distribution/instructions from the preview contact and stop deployment until prerequisites are met.

Local Node.js >=22, Git, GitHub CLI, authorized subscription, existing resource group, and approved location/connection settings are required. The preview contact supplies access and qualification; this repository does not supply onboarding or a list of qualified locations/platforms.

The [canonical product docs](https://builder.appservice.azure.com/docs/) and [current feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) govern support, prerequisites, and limitations. The skill consults maintained docs first, uses bundled procedures, and checks installed CLI help for syntax. Public documentation does not change Private Preview access. Local code/manifest inspection can happen before Git initialization or account connection; cloud actions remain gated on readiness and their own scope.

The [skill](../plugin/skills/app-service-builder/SKILL.md) includes self-contained [readiness](../plugin/skills/app-service-builder/references/prerequisites.md), [source](../plugin/skills/app-service-builder/references/source-and-manifest.md), [deployment](../plugin/skills/app-service-builder/references/deployment.md), and [operations](../plugin/skills/app-service-builder/references/operations.md) references. Unsupported or unqualified workflows must not be inferred from the existence of this plugin.

## Package layout and local checks

Both hosts read the same `plugin/skills/` tree. Copilot's entry point is `plugin/plugin.json`; Claude Code's is `plugin/.claude-plugin/plugin.json`. Keep those manifests identical. A single catalog at `.claude-plugin/marketplace.json` is supported by both hosts, so there is no duplicate catalog to drift.

From a checkout, use Node.js >=22 with no package installation:

```shell
node --test scripts/validate-plugin.test.mjs
node scripts/validate-plugin.mjs
```

These offline checks validate the deliberately small manifest schema, required metadata, version agreement, contained relative paths, both entry points, the single skill's frontmatter, local Markdown links, bundled references, canonical product documentation destinations, and installation-placeholder guardrails. Focused safety assertions protect source preservation, read-only reconciliation, and the CLI commit-selector distinction; they are not a semantic safety proof. Negative tests exercise broken metadata, paths, references, documentation destinations, and unsafe edits. They do not run `builder`, fetch sample source, validate live doc content/service access, or prove a deployment works.

If Claude Code is already available, `claude plugin validate ./plugin` and `claude plugin validate .` provide additional native manifest validation. Native discovery should be checked using isolated temporary host configuration, not by installing into a contributor's global configuration. Record the host/version and actual result in the PR; missing hosts or live preview checks remain explicit gaps.

Packaging references: [Copilot plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference), [Copilot marketplaces](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace), [Claude marketplaces](https://code.claude.com/docs/en/plugin-marketplaces), and the [Azure Container Apps plugin layout](https://github.com/microsoft/azure-container-apps/tree/main/plugin).

Feedback, support, security reporting, and the repository license remain governed by the [contribution guidance](../CONTRIBUTING.md), [support guidance](../SUPPORT.md), [security policy](../SECURITY.md), and [MIT license](../LICENSE).
