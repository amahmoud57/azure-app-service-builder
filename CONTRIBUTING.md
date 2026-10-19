# Contributing

This hub welcomes general product feedback, feature requests, bug reports, and improvements to its customer-facing resources. Contributions are welcome across the product. The product's implementation is not maintained in this repository.

## Choose the right channel

[Search existing issues](https://github.com/microsoft/azure-app-service-builder/issues?q=is%3Aissue), including closed issues, before submitting feedback. Use the appropriate [issue form](https://github.com/microsoft/azure-app-service-builder/issues/new/choose). For an existing request, add a reaction instead of a "+1" comment; add comments when they contribute a new use case or reproducible detail.

Describe the customer problem and outcome in your own words. Use small, sanitized examples for bugs. Do not include email addresses, account or contact details, credentials, subscription or resource IDs, customer data, or confidential diagnostics in titles, descriptions, comments, or attachments. Submissions to this repository are public.

Use [support guidance](SUPPORT.md) for urgent or account-specific problems. Report vulnerabilities privately through [SECURITY.md](SECURITY.md), never in an issue or pull request.

## What happens to feedback

New feedback is marked `needs-triage`. Maintainers review its category, clarify the customer problem when needed, and identify duplicates. The category labels are `feedback`, `enhancement`, and `bug`; the optional area field supplies context without an extensive label taxonomy.

Triage is not a delivery commitment or a response-time promise. An issue may remain open for discussion, be linked to an existing issue, or be closed with an explanation. Reactions help describe interest but do not determine priority on their own.

## Resource and documentation changes

Pull requests can improve this hub's instructions, public links, and feedback forms. Keep content suitable for public visibility and do not add internal links or unpublished product claims. Explain the customer-facing improvement in the pull request. Changes to form filenames, field IDs, labels, or headings must also update the [portal integration contract](docs/portal-feedback-integration.md).

For agent-plugin changes, keep both host manifests and the shared skill tree consistent, preserve preview/readiness boundaries, and run the offline checks in [plugin contribution guidance](docs/agent-plugin.md#package-layout-and-local-checks). Follow the [Builder CLI quickstart](https://builder.appservice.azure.com/docs/quickstarts/builder-cli/): customers obtain an approved portable archive from their preview contact and install that local file with npm. Keep the runtime prerequisite scoped to local manifest commands; do not add guessed registry packages, download URLs, or automatic installers.

## Contributor agreement and conduct

Most contributions require agreement to a Contributor License Agreement (CLA) confirming the right to grant us the rights to use the contribution. See [Contributor License Agreements](https://cla.opensource.microsoft.com). When you submit a pull request, follow the instructions from the CLA bot; you only need to complete this once across repositories using this CLA.

This project follows the [Microsoft Open Source Code of Conduct](CODE_OF_CONDUCT.md). See the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with questions or concerns. The [license](LICENSE) and the [trademark guidance in the README](README.md#trademarks) also apply.
