# Security Policy

## Supported versions

ShinUI is a static Next.js site deployed from the `main` branch. Security fixes are applied to **the latest release on `main` only**. Older commits and preview deployments are not supported.

| Version / branch | Supported |
| --- | --- |
| `main` (latest) | Yes |
| Older commits / forks | No |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security problems.**

Use [GitHub private vulnerability reporting](https://github.com/MarkShinozaki/ShinUI-Project/security/advisories/new) on this repository so details stay confidential until a fix is ready.

If private reporting is unavailable, contact [@MarkShinozaki](https://github.com/MarkShinozaki) via GitHub and ask for a secure channel — do not paste exploit details in public comments or issues.

Include, when you can:

- A clear description of the issue and impact
- Steps to reproduce
- Affected URLs or routes (e.g. `shinozaki.design` paths)
- Your environment (browser, if relevant)

## What we commit to

- **Acknowledgment:** Within **5 business days** of a valid report (sooner when possible).
- **Updates:** We will keep you informed of progress and expected fix timelines.
- **Disclosure:** We prefer coordinated disclosure after a fix is deployed; we credit reporters who want recognition (unless you prefer to stay anonymous).

## Scope notes

- Vulnerabilities in **third-party resources** listed in the index (external sites, npm packages we link to but do not host) are generally out of scope unless they are introduced or materially worsened by this repository’s code or deployment.
- **Dependency alerts** are tracked via GitHub Dependabot once enabled in repository settings.

Thank you for helping keep ShinUI and its users safe.
