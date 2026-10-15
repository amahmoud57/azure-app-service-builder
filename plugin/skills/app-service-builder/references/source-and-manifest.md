# Source and builder.yaml

Use the user's selected GitHub repository, pushed branch, and selected app source root. `builder.yaml` must exist at that source root. A local edit or local commit is not available to the service until pushed; inspect the diff and obtain authorization before committing or pushing source changes.

The selected source root and each component's `rootDirectory` are different: `rootDirectory` locates that component within the selected source. Do not move the selected root or reset the repository to a sample without agreement.

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

## HTTP application

A minimal single-component HTTP shape is:

```yaml
components:
  - name: backend
    role: web
    rootDirectory: .
    path: /
```

Confirm that the selected runtime/source is qualified for the preview: Node, Python, .NET, or PHP 8.5. The app must serve HTTP on `0.0.0.0`, normally port `8080`, with an app-owned health route. Inspect actual startup and health behavior; do not assume the example supplies them.

`run.start` is an optional override, not a universal requirement. Custom build output belongs under `$DESTINATION_DIR`. Before adding build/start overrides, consult the current preview documentation from the preview contact and inspect the chosen source; do not guess manifest keys or runtime-specific commands.

## Combined shape and samples

At most one static component and one public HTTP component are covered. When combining them, declare both public paths explicitly and account for the backend receiving its prefix. Do not equate this shape with Next.js standalone support.

The public [App Service Builder Node.js sample](https://github.com/Azure-Samples/app-service-builder-nodejs) is a reference, not a mandatory replacement for the user's source. Its root `builder.yaml` belongs at repository root. Do not fetch or vendor sample source merely to validate this plugin. If a customer selects the sample, still verify its target, runtime, and health behavior against their approved preview settings.
