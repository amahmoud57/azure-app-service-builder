# Portal feedback integration: GitHub handoff

The destination is **`microsoft/azure-app-service-builder`** on GitHub. It is a product-wide resource and feedback hub, not the product source repository or an Azure support channel.

This guide defines the GitHub intake contract. It does not implement portal code, select the portal architecture, provision credentials, or grant permissions. A user-controlled redirect to a GitHub Issue Form is the simplest starting point; the portal integration owner can choose the appropriate design.

## Publication and access gates

The repository is public. GitHub uses issue forms from the default branch (`main`). Repository visibility and feedback intake do not grant access to the App Service Builder Private Preview or announce public service availability.

GitHub requires users to sign in to submit an issue. A public issue is attributable to its GitHub author and is not anonymous feedback. Anonymous portal feedback requires a separate mechanism; it must not silently become a public GitHub issue.

Before enabling customer-facing links, confirm the merged forms and the labels below, then exercise each form with an authorized reviewer without submitting a customer issue. Check chooser order, required fields, text prefill, labels, and the security/support exits. Browser behavior cannot be confirmed from unmerged files alone.

## Category and label mapping

Template files live in `.github/ISSUE_TEMPLATE/`. Keep filenames and field IDs stable; update this guide and portal callers together if the contract changes.

| Category | Template filename | Applied labels |
| --- | --- | --- |
| General feedback | `01-general-feedback.yml` | `feedback`, `needs-triage` |
| Feature request | `02-feature-request.yml` | `enhancement`, `needs-triage` |
| Bug report | `03-bug-report.yml` | `bug`, `needs-triage` |

`feedback` means general product input; `needs-triage` means awaiting initial maintainer review. `bug` and `enhancement` are the existing category labels.

Ensure these labels exist in the destination repository; names in a YAML form do not create labels. The intake setup adds the missing `feedback` and `needs-triage` labels and preserves existing category labels.

## Browser entry points and URL prefill

- [General feedback](https://github.com/microsoft/azure-app-service-builder/issues/new?template=01-general-feedback.yml)
- [Feature request](https://github.com/microsoft/azure-app-service-builder/issues/new?template=02-feature-request.yml)
- [Bug report](https://github.com/microsoft/azure-app-service-builder/issues/new?template=03-bug-report.yml)
- [Form chooser](https://github.com/microsoft/azure-app-service-builder/issues/new/choose)
- [Search existing issues](https://github.com/microsoft/azure-app-service-builder/issues?q=is%3Aissue)

The `template` query parameter selects the exact filename, including `.yml`. `title` can prefill the issue title. For Issue Form text fields, use the field's `id` as the query parameter name, not its display label. For example, this uses the general form's `details` field:

```text
https://github.com/microsoft/azure-app-service-builder/issues/new?template=01-general-feedback.yml&title=Improve%20feedback%20discoverability&details=The%20feedback%20entry%20point%20is%20hard%20to%20find.
```

Build query strings with a URL encoder, such as `URLSearchParams`, rather than concatenating user text. Keep any prefill brief and explicitly reviewed by the user. URL parameters can appear in history, logs, and referrers: never place email addresses, account/contact details, credentials, subscription or resource IDs, customer data, or confidential diagnostics in a URL, title, or issue body.

Use only the selected form's allowlisted text-field IDs below and an optional sanitized `title`. Do not use `body` to replace an Issue Form, add `labels` or `assignees` overrides, forward unknown payload fields wholesale, or infer parameters from arbitrary portal context. This handoff does not depend on dropdown prefill; let the user choose `area` in GitHub. Never pre-check or prefill `privacy`: acknowledgement is a deliberate user action.

See GitHub's [creating an issue guidance](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue) for URL query parameters and [Issue Forms syntax](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms) for the YAML contract. Recheck text prefill against the merged form before rollout.

## Stable field contract

All fields are `textarea` unless shown otherwise. The submitted Markdown heading is the exact `attributes.label` value. A concise, sanitized issue title is also required by GitHub, separate from these fields.

| Form | Field ID | Submitted heading | Required |
| --- | --- | --- | --- |
| General | `details` | Feedback details | Yes |
| General | `area` | Product area | No; dropdown |
| General | `context` | Additional context | No |
| General | `privacy` | Public sharing acknowledgement | Yes; checkbox option |
| Feature | `problem` | Customer problem | Yes |
| Feature | `outcome` | Desired outcome | Yes |
| Feature | `area` | Product area | No; dropdown |
| Feature | `alternatives` | Alternatives considered | No |
| Feature | `privacy` | Public sharing acknowledgement | Yes; checkbox option |
| Bug | `description` | Bug description | Yes |
| Bug | `steps` | Steps to reproduce | Yes |
| Bug | `expected` | Expected behavior | Yes |
| Bug | `actual` | Actual behavior | Yes |
| Bug | `area` | Product area | No; dropdown |
| Bug | `environment` | Environment and regression context | No |
| Bug | `privacy` | Public sharing acknowledgement | Yes; checkbox option |

The shared `area` options, in order, are `Portal`, `CLI`, `Build or deployment`, `Running applications`, `Documentation`, and `Other or unsure`. The field is optional; do not silently assign a surface or imply the listed areas are supported product capabilities.

The `privacy` checkbox has one required option, with this exact label:

> I understand that this submission is intended for public sharing, and I have removed personal, sensitive, and confidential information. This is not a security vulnerability report.

## Browser redirect versus backend creation

For a browser redirect, the customer reviews the prefill, completes required fields, deliberately acknowledges public sharing, and submits in GitHub under their own account. Opening a link is not submission consent and does not create an issue.

A future backend using [GitHub's create-an-issue REST endpoint](https://docs.github.com/en/rest/issues/issues#create-an-issue) sends an issue `title`, Markdown `body`, and labels directly. The API **does not run Issue Form templates or enforce their required fields, checkbox acknowledgement, or label mapping**. There is no Issue Form `template` parameter for REST creation.

REST label assignment requires an API actor with push access; GitHub silently drops labels otherwise. Verify the returned issue and labels rather than treating an HTTP success as proof that categorization succeeded. This is a design constraint, not a request to grant access or provision credentials.

Such an integration would need its own validation for the selected category, nonempty required text and title, the exact optional area enum, an explicit affirmative public-sharing acknowledgement, and the fixed category labels. Validate and minimize only known fields, reject unknown categories and invalid fields explicitly, and require acknowledgement rather than defaulting it to true. Keep security reports and account-specific diagnostics out of this path. Do not forward unrecognized payload properties or attachments wholesale.

Render only validated fields with `###` headings matching the table, in form order. Optional unanswered fields may be omitted; do not manufacture context. Text must remain within its intended section: handle Markdown safely so user content cannot masquerade as an acknowledgement or maintainer-assigned status. For an affirmed `privacy` value, render the final section as:

```markdown
### Public sharing acknowledgement

- [x] I understand that this submission is intended for public sharing, and I have removed personal, sensitive, and confidential information. This is not a security vulnerability report.
```

The preceding sections must be, in order:

| Category | Body headings before acknowledgement |
| --- | --- |
| General feedback | `### Feedback details`, `### Product area` (optional), `### Additional context` (optional) |
| Feature request | `### Customer problem`, `### Desired outcome`, `### Product area` (optional), `### Alternatives considered` (optional) |
| Bug report | `### Bug description`, `### Steps to reproduce`, `### Expected behavior`, `### Actual behavior`, `### Product area` (optional), `### Environment and regression context` (optional) |

Backend-created issues are authored by the authenticated API actor, not automatically by the customer. Do not promise anonymity or imply a customer GitHub identity that the API has not established. Credentials, permissions, attribution, moderation, rate limiting, and error handling would require a separate design and approval; none are provisioned here. Failures must be surfaced to the user, not reported as successful feedback delivery.

## Consent and private contact

Public GitHub submission consent is distinct from permission to contact someone privately. The GitHub forms deliberately collect no email, account, or contact information. If the portal separately offers a private contact field and permission, keep both out of GitHub titles, bodies, comments, attachments, and URL parameters; do not add them to these forms. That private flow and its consent handling are outside this handoff.

Use [support guidance](../SUPPORT.md) for service or account support and [SECURITY.md](../SECURITY.md) for private vulnerability reporting. Feedback submission is not a promise to implement incoming requests.
