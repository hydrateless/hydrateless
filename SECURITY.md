# Security Policy

## Supported versions

Hydrateless is pre-1.0. Security fixes land on `main` and ship in the next
release; only the latest published minor receives them.

| Version            | Supported                         |
| ------------------ | --------------------------------- |
| Latest `0.x` minor | Yes                               |
| Older `0.x` minors | No, upgrade to the latest release |

## Reporting a vulnerability

Please don't open a public issue for security reports. Use GitHub's private
vulnerability reporting instead:

1. Go to the repository's **Security** tab.
2. Choose **Report a vulnerability** and fill in the advisory form.

Include the affected package (`hydrateless`, `@hydrateless/enhancers`,
`@hydrateless/auto`, `@hydrateless/react`, `@hydrateless/vue`, or
`@hydrateless/svelte`), the version, a minimal reproduction, and the impact you
believe it has.

You'll get an acknowledgment within 72 hours and a resolution plan within seven
days. Once a fix is published, we'll credit you in the advisory unless you ask
us not to.

## Scope

In scope:

- Cross-site scripting through any enhancer or framework component that
  inserts markup (for example the toast region's `show(message)`, the table of
  contents, or rendered pagination). These APIs are expected to treat input as
  text, never HTML.
- Prototype pollution or arbitrary code execution through `data-hl-*` attribute
  parsing or option merging.
- Supply-chain issues in the published packages or the release workflow.

Out of scope:

- Vulnerabilities in the browsers' native features the library relies on
  (Popover API, `<dialog>`, Invoker Commands).
- Issues that require the attacker to already control the page's script or
  markup.
- The documentation site, unless the issue affects the published packages.

## Provenance

All packages are published to npm from the release workflow with provenance
attestations via Trusted Publishing, so each version can be traced back to the
commit and workflow run that produced it.
