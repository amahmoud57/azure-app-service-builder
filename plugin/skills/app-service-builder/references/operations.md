# Inspect, recover, and delete

Read command-specific help first. Every command below needs actual target values. Do not publish raw account details, operation URLs, or confidential logs in public feedback.

Consult maintained [logging and monitoring](https://builder.appservice.azure.com/docs/guides/logging-and-monitoring/), [troubleshooting](https://builder.appservice.azure.com/docs/troubleshooting/), [deployment semantics](https://builder.appservice.azure.com/docs/guides/deployments/), and the [CLI reference](https://builder.appservice.azure.com/docs/reference/builder-cli/). Use [feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) to distinguish supported diagnostics from planned runtime features.

## Inspect apps and history

```shell
builder app list --subscription "<subscription-id>" --json
builder app show "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app version list "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app version show "<app-name>" "<version-id>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app version build-log "<app-name>" "<version-id>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app deployment list "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app deployment show "<app-name>" "<deployment-id>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
builder app deploymentlog "<app-name>" "<deployment-id>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
```

Version and deployment IDs must come from actual history. Use build logs to diagnose build failure and deployment logs to diagnose activation failure. `version build-log` can select `--component "<component>"` when needed. These commands are not runtime log streaming or live HTTP metrics; do not invent equivalent CLI commands.

## Uncertain writes and retries

A timeout, cancellation, or lost response does not prove a failed or cancelled server operation. Retain the exact target, request ID, returned operation URL, and known version/deployment IDs without exposing secrets. Inspect the actual app/source state, returned operation, and deployment history before retrying:

```shell
builder app status "<operation-url>" --subscription "<subscription-id>" --json
```

Use the returned URL only if known and trusted; if none was received, reconcile through app/history reads. Reconciliation is read-only: it must not implicitly resume writes, rollback/delete, or create duplicate apps, forks, or deployments. Preserve successful provisioning or source connection when a later step fails. An uncertain result is not evidence that all steps failed.

Only after reconciliation and within the approved action, retry identical CLI deployment intent with the same `--request-id <id>`. A changed intent needs a new ID, not reuse of the old one. Respect pending-operation conflicts rather than replacing the active version. Do not promise universal cancellation or assume interrupting a local wait stops the server.

## Recover an eligible retained version

Inspect the actual intended retained version and establish that it is ready and eligible. Explain the app, subscription, resource group, target version, and activation action; obtain user approval before rollback:

```shell
builder app deploy "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --version "<version-id>"
```

Alternatively, use `--previous` only after inspecting which retained target it will activate and getting approval. Do not combine selectors. Retained-version activation does not rebuild local changes or overwrite retained versions. Do not require fresh source authorization merely to activate retained content.

After activation, follow [deployment verification](deployment.md). A completed operation alone is not evidence that the recovered app serves HTTP.

## Delete only an explicitly approved app

Inspect the exact target first and explain the consequence. **Ask for explicit approval before deleting.** Separately owned Azure resources and data survive app deletion and may continue to incur costs; deletion is not complete resource-group cleanup.

After approval, retain the CLI's confirmation:

```shell
builder app delete "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>"
```

Do not bypass confirmation with `--yes` or `-y` in normal examples, automatically delete the resource group, or remove separately owned resources/data as a follow-on action.
