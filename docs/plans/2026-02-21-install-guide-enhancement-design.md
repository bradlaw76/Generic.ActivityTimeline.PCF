# Install Guide Enhancement Design
**Date:** 2026-02-21
**Status:** Approved
**Target file:** `docs/powerapps-environment-install.md`

---

## Overview

Enhance the existing install guide to serve two distinct audiences — **developers** doing iterative dev pushes, and **Power Platform admins** doing environment-level installs and production promotions — without splitting into multiple files.

**Approach chosen:** C — Enhanced single doc with audience callouts.

---

## Design

### Structural changes

- Keep the existing linear step structure intact
- Add a short **Audience** section at the top explaining which sections apply to which role
- Add two **Quick Start** blocks at the bottom: one for developers (existing), one for admins (portal-only path)

### Per-section enrichments

| Section | Enhancement |
|---|---|
| Prerequisites | Add `> For Admins:` callout — what they need vs developers |
| Authenticate | Add "How to find your environment URL" with Maker Portal navigation steps |
| Push | Add "How to find your publisher prefix" with Maker Portal navigation steps |
| Add to form | Add explanation of what `recordId` and `entityName` do |
| Validate | Add `> For Developers:` callout about harness testing |
| Troubleshooting | Add 3–4 more failure cases with remediation |

### Callout conventions

Use blockquote style consistently:

```markdown
> **For Admins:** ...
> **For Developers:** ...
> **Note:** ...
```

### New troubleshooting entries

- Control loads but shows wrong data (wrong environment selected)
- Push succeeds but old version still shows (browser cache)
- `pac pcf push` fails with "No publisher found" (prefix mismatch)
- Managed solution import fails (version conflict)

---

## Success criteria

- A developer can follow the doc end-to-end without confusion
- An admin can identify their path without reading developer-only steps
- Finding the publisher prefix and environment URL requires no external lookup
- Troubleshooting covers the most common failure modes for both roles
