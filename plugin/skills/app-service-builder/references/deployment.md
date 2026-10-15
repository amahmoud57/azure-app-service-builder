# Initialize, deploy, and verify

First complete [readiness](prerequisites.md) and inspect [source and builder.yaml](source-and-manifest.md). All placeholders below require actual verified values. Confirm the exact target/action and authorization before a state-changing command; never assume a generic deployment request has selected Builder.

## Initialize interactively

Read `builder init --help`, then use the selected pushed source and approved preview location:

```shell
builder init "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --location "<qualified-location>" --repository "<owner>/<repository>" --branch "<branch>"
```

Review and confirm interactive values. Initialization creates or reuses the app and connects its source. It does not deploy or upload local changes. It does not create a saved local app binding: subsequent commands still require app name, subscription, and resource group.

This guide intentionally uses interactive initialization. Noninteractive initialization additionally needs the numeric repository ID, all explicit values, pre-established accounts, and `--yes`; it is not a way to approve guessed values. Do not turn this example into an unattended setup promise.

## Deploy pushed source

Read `builder app deploy --help` and inspect the intended source/target before deployment:

```shell
builder app deploy "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>"
```

Deployment waits by default. Optional selectors are mutually exclusive: `--rebuild`, `--commit <sha>`, `--version <id>`, or `--previous`. Use only the selector matching the approved action. Inspect retained targets before `--version` or `--previous`; see [operations](operations.md).

If the user intentionally chooses `--no-wait`, capture the returned operation URL and track that operation rather than guessing its result:

```shell
builder app status "<operation-url>" --subscription "<subscription-id>" --wait --json
```

The operation URL must be the actual returned service value under the approved connection settings. Do not fabricate it, send credentials to an untrusted URL, or treat request acceptance as completion.

## Verify service behavior

Inspect the deployed app:

```shell
builder app show "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
```

Read the **returned runtime URL**, app state, and actual deployed version. Never synthesize a hostname. Use the user's available HTTP/browser tooling to check real HTTP behavior and the configured app-owned health endpoint, with the app's expected access requirements. Do not guess a `/health` route or confuse management login with visitor sign-in.

A successful build, accepted deployment, or completed operation is insufficient by itself. If HTTP/health verification cannot be performed or fails, state that the app is not verified serving and inspect the relevant history/logs. Do not deploy repeatedly or claim success to conceal a blocked stage.
