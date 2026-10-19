# Azure App Service Builder

This repository is the customer resource and product feedback hub for Azure App Service Builder. Feedback can cover the whole product. This is not the product source code repository or a replacement for Azure Support.

App Service Builder is in **Private Preview for development/test, not production**. This public resource hub does not grant preview access or announce public service availability. See the [App Service Builder documentation](https://builder.appservice.azure.com/docs/) for product instructions, prerequisites, and limitations.

## Agent skills plugin

The `builder` agent plugin contains one customer-facing skill, `app-service-builder`, for GitHub Copilot CLI and Claude Code. Install it through the repository-hosted marketplace using your installed host:

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

See [plugin installation and readiness limits](docs/agent-plugin.md) for verification commands and usage.

Plugin installation is separate from Builder CLI installation and preview access. Obtain the approved portable `azure-builder-cli-<version>.tgz` archive from your preview contact and follow the [Builder CLI quickstart](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/). Node.js 22 or later is required; the separate .NET runtime is only for local manifest commands, not login, initialization, or deployment. Customers do not need the .NET SDK.

## Share feedback

[Search existing issues](https://github.com/microsoft/azure-app-service-builder/issues?q=is%3Aissue) before opening a new one. Use a reaction on an existing issue to show that it matters to you, and add a comment when you have new context.

| What you want to share | Where to start |
| --- | --- |
| An experience, suggestion, or general product question | [General feedback](https://github.com/microsoft/azure-app-service-builder/issues/new?template=01-general-feedback.yml) |
| A customer problem and a desired new capability | [Feature request](https://github.com/microsoft/azure-app-service-builder/issues/new?template=02-feature-request.yml) |
| Something that did not behave as expected | [Bug report](https://github.com/microsoft/azure-app-service-builder/issues/new?template=03-bug-report.yml) |
| An account-specific problem or an urgent service issue | [Support guidance](SUPPORT.md) |
| A suspected security vulnerability | [Security policy and private reporting](SECURITY.md) |

**Treat issue titles, descriptions, comments, and attachments as public.** Do not include email addresses, account or contact details, credentials, subscription or resource IDs, customer data, or confidential diagnostics. Report vulnerabilities privately, not in GitHub Issues.

This repository is public. Repository visibility and feedback intake are separate from product availability and preview access.

## Resources

See [contribution guidance](CONTRIBUTING.md) for feedback and documentation contributions, and the [portal feedback integration guide](docs/portal-feedback-integration.md) for the GitHub handoff.

The following are **related Azure resources**, not product-specific Azure App Service Builder instructions or promises of supported features:

- [Azure App Service documentation](https://learn.microsoft.com/azure/app-service/)
- [Azure documentation](https://learn.microsoft.com/azure/)
- [Azure support options](https://azure.microsoft.com/support/options/)
- [Azure status](https://azure.status.microsoft/)

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit [Contributor License Agreements](https://cla.opensource.microsoft.com).

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
