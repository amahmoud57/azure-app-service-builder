# Source and builder.yaml

Consult maintained [source control](https://builder.appservice.azure.com/docs/guides/source-control/), [builder.yaml authoring](https://builder.appservice.azure.com/docs/guides/builder-yaml/), and [runtime guidance](https://builder.appservice.azure.com/docs/reference/runtimes/). Check [feature availability](https://builder.appservice.azure.com/docs/resources/feature-status/) for qualification; language/build recognition alone does not establish supported runtime versions or deployment targets.

## Select and reconcile source

Inspect the user's actual local code/manifest before Git initialization or account connection if useful. Before publishing or deploying edits, bind the exact intended app and Azure coordinates, canonical repository identity (including numeric ID), connected branch, source attachment root, and deliberately selected checkout. Inspect a credential-free origin and actual app source settings. Do not scan the user's disks for checkouts or reset, stash, or change branches without approval. Preserve dirty/unrelated work and review only the intended diff.

Confirm intended changes are committed and pushed to the connected branch. Different local/remote SHAs alone do not establish ahead/behind: inspect ancestry against current remote evidence, distinguishing ahead, behind, and diverged histories. Distinguish a missing repository/ref from denied access (a not-found response can mask permissions) before suggesting a push. If access or ancestry is unknown, report that rather than overwriting remote work. Source publication needs its own authorization; local preview or plan approval is not permission to push.

`builder.yaml` must exist at the source attachment root in the selected pushed revision. The attachment root and each component's `rootDirectory` differ: `rootDirectory` locates that component within the selected source. For example, attachment root `apps/store` and component root `web` select `apps/store/web`. Do not move the attachment root or reset the repository to a sample without agreement.

## Static browser assets

For already-committed browser content in `public/`, a minimal example is:

```yaml
components:
  - name: frontend
    role: static
    rootDirectory: .
    output: public
    path: /
```

Publish only intended browser assets. Never expose a source directory containing secrets, configuration credentials, or server-only code as static output.

Pure committed static files may need no dependency installation, build, or process startup. Inspect the selected files and manifest, and describe only the checks actually performed; do not invent a toolchain to make the workflow look tested.

## HTTP application

A minimal single-component HTTP shape is:

```yaml
components:
  - name: backend
    role: web
    rootDirectory: .
    path: /
```

Honor the user's selected runtime and actual project, not just the available starter. Recognized identifiers include Node, Python, .NET, and PHP; that does not qualify every version, framework, or target. In particular, feature status currently labels a running PHP sample under construction. Confirm exact runtime/version and target readiness before deployment. The app must serve HTTP on `0.0.0.0` at its declared port, normally `8080`. Inspect actual listener and app-owned health behavior; the example does not implement them.

`run.start` is an optional override, not a universal requirement. Custom build output belongs under `$DESTINATION_DIR`. Verify applicable keys against current manifest/runtime docs and the installed version before adding overrides. Do not invent a Dockerfile, dev startup command, framework support, reserved health path, or `/` as a universal health fix. Any configured health route must actually exist and satisfy the documented policy inside its public mount.

## Combined shape and samples

At most one static component and one public HTTP component are covered, with combined-shape availability requiring confirmation. When combining them, declare both public paths explicitly and account for the backend receiving its prefix. Do not equate this shape with Next.js standalone support.

The public [App Service Builder Node.js sample](https://github.com/Azure-Samples/app-service-builder-nodejs) is a reference, not a mandatory replacement for the user's source. Its root `builder.yaml` belongs at repository root. Do not fetch or vendor sample source merely to validate this plugin. If a customer selects the sample, still verify its target, runtime, and health behavior against their approved preview settings.

A starter is optional, not a prerequisite for existing code or supported runtime use. Before creating a requested fork, check for an existing usable owner fork and preserve its customizations; do not reset it to match a sample SHA. A fork request's acceptance is not readiness: verify actual repository identity, upstream relationship, and intended branch before using it. Reconcile an unknown outcome read-only before another create request. A working starter does not qualify every fork or source customization.
