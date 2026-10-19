# App Service Builder agent plugin

The `builder` plugin provides the `app-service-builder` skill for GitHub Copilot CLI and Claude Code, for authorized **Private Preview development/test, not production** use.

## Install

Use your installed host's two-step marketplace installation.

### GitHub Copilot CLI

```shell
copilot plugin marketplace add microsoft/azure-app-service-builder
copilot plugin install builder@azure-app-service-builder
```

### Claude Code

```shell
claude plugin marketplace add microsoft/azure-app-service-builder
claude plugin install builder@azure-app-service-builder
```

This installs the agent plugin, not the Builder CLI. Obtain the approved portable `azure-builder-cli-<version>.tgz` archive from your preview contact and follow the [Builder CLI quickstart](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/). Node.js 22 or later is required; the separate .NET runtime is only for local manifest commands, not login, initialization, or deployment. Customers do not need the .NET SDK. Plugin installation does not grant preview access or establish hosted deployment qualification.

See the [full installation guide and readiness limits](../docs/agent-plugin.md), [canonical product documentation](https://builder.appservice.azure.com/docs/), and [skill instructions](skills/app-service-builder/SKILL.md).
