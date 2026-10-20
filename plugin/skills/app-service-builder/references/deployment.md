# Initialize, deploy, and verify

First complete [readiness](prerequisites.md) and inspect [source and builder.yaml](source-and-manifest.md). All placeholders below require actual verified values. Confirm the exact target/action and authorization before a state-changing command; never assume a generic deployment request has selected Builder.

Consult maintained [deployments and versions](https://builder.appservice.azure.com/docs/guides/deployments/), [source control](https://builder.appservice.azure.com/docs/guides/source-control/), and the [CLI reference](https://builder.appservice.azure.com/docs/reference/builder-cli/). Check current [feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) before recommending a workflow; confirm installed help rather than guessing syntax when versions differ.

## Initialize interactively

Run initialization from inside an initialized Git worktree for the user's selected app. GitHub sign-in does not select a local repository. Open the app's cloned checkout or change to that directory first; use `git rev-parse --show-toplevel` to verify the location if needed. Do not initialize Git in your home directory to get past the worktree error.

Read `builder init --help`, then start setup from that checkout with the approved preview target.

`builder init` does not automatically analyze or modify `builder.yaml`. Setup does not require a local manifest, a clean worktree, or a local commit matching the pushed branch. It still requires the approved target, management credentials, and source permissions.

Local manifest validation is optional and separate from initialization. Review intended configuration changes and obtain approval before writing, committing, or pushing them. Preserve dirty/unrelated work; do not reset, stash, or change branches to make setup pass. Deploy only the intended pushed source, not uncommitted local changes.

```shell
builder init
```

Review and confirm interactive values. App provisioning, source connection/authorization, and deployment are distinct effects even when `init` combines setup. Initialization is not an explicit deploy or local-source upload. Reuse matching already-configured source; do not reconnect needlessly. A source change may trigger configured automation on targets where enabled: disclose that effect before writing, without promising a working push-deployment workflow in this preview. Preserve successful setup if a later step fails and retry only the missing step.

Initialization does not create a saved local app binding: subsequent commands still require app name, subscription, and resource group. For a selected non-root source attachment, inspect current source settings and use the documented `builder app source connect github` flow and its `--root-directory` option only after checking installed help and confirming scope; the init example above must not silently attach the wrong root.

This guide intentionally uses interactive initialization. Noninteractive initialization additionally needs the numeric repository ID, all explicit values, pre-established accounts, and `--yes`; `--yes` cannot approve autodetected values. Do not turn this example into an unattended setup promise.

## Deploy pushed source

Read `builder app deploy --help` and inspect the intended source/target before deployment:

```shell
builder app deploy --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>"
```

Deployment waits by default. If a status read fails, including HTTP 429, follow [uncertain-write reconciliation](operations.md#uncertain-writes-and-retries) before considering another deployment. A failed local wait does not establish that the server operation failed.

Use at most one selector:

| Selector | Requested content |
| --- | --- |
| None | Resolve the configured branch; reuse an exact ready match or build a version |
| `--rebuild` | Build a new version from the configured branch |
| `--commit <sha>` | Request an exact full 40-character hexadecimal commit with current desired version configuration |
| `--version <id>` | Activate that eligible retained ready version with frozen configuration |
| `--previous` | Activate the successful different retained version selected from deployment history |

The CLI validates `--commit` as exactly 40 hexadecimal characters and forwards it in the deployment request. Use it for reproducible requested source rather than assuming a previously observed branch HEAD will be selected. Still verify the actual resulting version and serving response. Inspect retained targets and get approval before `--version` or `--previous`; see [operations](operations.md).

For retries of the same deployment intent, `--request-id <id>` is a stable idempotency key; absent an explicit ID, the CLI generates a UUID. Retain that ID with the target and returned operation URL. Changing source/intent while reusing the ID can cause an idempotency conflict. Read [uncertain-write reconciliation](operations.md#uncertain-writes-and-retries) before retrying a timeout, cancellation, or lost response.

If the user intentionally chooses `--no-wait`, capture the returned operation URL and track that operation rather than guessing its result:

```shell
builder app status "<operation-url>" --subscription "<subscription-id>" --wait --json
```

The operation URL must be the actual returned service value under the approved connection settings. Do not fabricate it, send credentials to an untrusted URL, or treat request acceptance as completion.

## Verify service behavior

Inspect the deployed app:

```shell
builder app show --name "<app-name>" --subscription "<subscription-id>" --resource-group "<resource-group>" --json
```

Distinguish the observed branch SHA, requested commit, built version, activation attempt, active version/deployment, and real HTTP/health response. A moving branch or newer failed attempt does not identify what currently serves.

Read the **returned runtime URL**, app state, and actual deployed version. Never synthesize a hostname. Use the user's available HTTP/browser tooling to check real HTTP behavior and the configured app-owned health endpoint, with the app's expected access requirements. Do not guess a `/health` route or confuse management login with visitor sign-in.

A successful build, accepted deployment, or completed operation is insufficient by itself. If HTTP/health verification cannot be performed or fails, state that the app is not verified serving and inspect the relevant history/logs. Do not deploy repeatedly or claim success to conceal a blocked stage.
