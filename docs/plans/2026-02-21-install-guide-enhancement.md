# Install Guide Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance `docs/powerapps-environment-install.md` to serve both developers and Power Platform admins by adding audience callouts, contextual how-to guidance, expanded troubleshooting, and dual quick-start blocks.

**Architecture:** Single-file enhancement — no structural reorganization, only additive enrichment. All changes are to one markdown file. No code files are touched.

**Tech Stack:** Markdown (GitHub-flavored), blockquote callout convention (`> **For Admins:**`, `> **For Developers:**`, `> **Note:**`)

---

### Task 1: Add audience orientation section at the top

**Files:**
- Modify: `docs/powerapps-environment-install.md` (after the H1 title, before "Tooling method used")

**Step 1: Insert the audience section**

Add this block immediately after the `# Install Guide: Deploy this PCF Control to a Power Apps Environment` heading:

```markdown
## Who this guide is for

This guide covers two audiences. Most sections apply to both.

- **Developers** — building, iterating, and pushing the control to a dev environment via `pac pcf push`
- **Power Platform Admins** — deploying to test/production via managed solution import in Maker Portal

> **For Admins:** You do not need Node.js, npm, or `pac` CLI for production deployments. Jump to [Section 7 — Recommended production path](#7-recommended-production-path) if a developer has already exported the managed solution for you.

> **For Developers:** Follow every section in order. The Quick Start at the bottom is your fastest path once you've done this once.
```

**Step 2: Verify the file renders correctly**

Open `docs/powerapps-environment-install.md` in VS Code preview (`Ctrl+Shift+V`) and confirm the new section appears before "Tooling method used."

**Step 3: Commit**

```bash
git add docs/powerapps-environment-install.md
git commit -m "docs: add audience orientation section to install guide"
```

---

### Task 2: Add admin/developer callouts to Prerequisites

**Files:**
- Modify: `docs/powerapps-environment-install.md` (Section 1 — Prerequisites)

**Step 1: Replace the Prerequisites section**

Replace the existing Section 1 block with:

```markdown
## 1. Prerequisites

**All users:**
- Access to a Power Apps environment (example URL: `https://<org>.crm.dynamics.com`)
- Permissions to customize tables/forms (System Customizer or System Administrator role)

**Developers only:**
- Power Platform CLI (`pac`) installed — [install guide](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)
- Node.js (v16+) and npm installed

> **For Admins:** You do not need Node.js or `pac` CLI unless you are doing dev pushes yourself.

Quick checks (developers):

```powershell
node -v
npm -v
pac help
```

> Note: `pac --version` is not a valid command on this CLI build. Use `pac help` to confirm install.
```

**Step 2: Verify in VS Code preview**

Confirm the role split is clear and the code block still renders.

**Step 3: Commit**

```bash
git add docs/powerapps-environment-install.md
git commit -m "docs: add role-split prerequisites to install guide"
```

---

### Task 3: Add "How to find your environment URL" to Authenticate section

**Files:**
- Modify: `docs/powerapps-environment-install.md` (Section 3 — Authenticate)

**Step 1: Insert the how-to callout after the code block in Section 3**

After the `pac auth select --index 1` code block, add:

```markdown
> **How to find your environment URL:**
> 1. Go to [make.powerapps.com](https://make.powerapps.com)
> 2. Select your target environment from the top-right environment picker
> 3. Go to **Settings** (gear icon) → **Session details**
> 4. Copy the **Instance url** — this is your environment URL
>
> It will look like: `https://yourorg.crm.dynamics.com`
```

**Step 2: Verify in VS Code preview**

Confirm the callout is nested inside the blockquote correctly and the URL format example is visible.

**Step 3: Commit**

```bash
git add docs/powerapps-environment-install.md
git commit -m "docs: add how-to find environment URL to authenticate section"
```

---

### Task 4: Add "How to find your publisher prefix" to Push section

**Files:**
- Modify: `docs/powerapps-environment-install.md` (Section 4 — Push)

**Step 1: Insert the how-to callout after the example code block in Section 4**

After the `pac pcf push --publisher-prefix contoso` code block, add:

```markdown
> **How to find your publisher prefix:**
> 1. Go to [make.powerapps.com](https://make.powerapps.com)
> 2. Select your environment
> 3. Go to **Solutions** in the left nav
> 4. Open your solution (or create one if none exists)
> 5. Go to **Publisher** — the **Prefix** field is your publisher prefix
>
> Example: if your publisher prefix is `contoso`, run `pac pcf push --publisher-prefix contoso`
>
> **Note:** The prefix must match the publisher already registered in your environment. Using a mismatched prefix will cause an error.
```

**Step 2: Verify in VS Code preview**

Confirm the callout renders cleanly with the numbered list and example.

**Step 3: Commit**

```bash
git add docs/powerapps-environment-install.md
git commit -m "docs: add how-to find publisher prefix to push section"
```

---

### Task 5: Add control inputs explanation to Add to Form section

**Files:**
- Modify: `docs/powerapps-environment-install.md` (Section 5 — Add control to a form)

**Step 1: Extend step 7 with input explanations**

Replace the existing step 7:

```markdown
7. Bind inputs:
   - `recordId`
   - `entityName`
```

With:

```markdown
7. Bind inputs:
   - `recordId` — the unique identifier of the record currently open (e.g., an Account or Contact ID). The control uses this to fetch related activity data.
   - `entityName` — the logical name of the table (e.g., `account`, `contact`). The control uses this to scope its data queries to the correct entity type.

> **For Admins:** Both fields are required. If either is unbound, the control will load but show no data. Use the **Static value** option only for testing — in production, bind to the form's record context.
```

**Step 2: Verify in VS Code preview**

Confirm the nested blockquote and the list items render correctly.

**Step 3: Commit**

```bash
git add docs/powerapps-environment-install.md
git commit -m "docs: add control input explanations to add-to-form section"
```

---

### Task 6: Add developer harness callout to Validate section

**Files:**
- Modify: `docs/powerapps-environment-install.md` (Section 6 — Validate)

**Step 1: Add developer callout after the existing validate content**

After the last bullet point in Section 6, add:

```markdown
> **For Developers:** Before pushing to an environment, test locally with the PCF test harness:
> ```powershell
> npm start
> ```
> This launches a browser at `http://localhost:8181` where you can interact with the control. Note that `recordId` and `entityName` will be empty in harness mode — the control will show an empty/loading state. This is expected.
```

**Step 2: Verify in VS Code preview**

Confirm the fenced code block inside the blockquote renders correctly.

**Step 3: Commit**

```bash
git add docs/powerapps-environment-install.md
git commit -m "docs: add developer harness callout to validate section"
```

---

### Task 7: Expand the Troubleshooting section

**Files:**
- Modify: `docs/powerapps-environment-install.md` (Section 8 — Troubleshooting)

**Step 1: Add four new troubleshooting entries at the end of Section 8**

After the existing "Control on form but no data" entry, add:

```markdown
### Control loads but shows data from wrong records

- Verify the environment selected in Maker Portal matches the one used in `pac auth`
- Check that `recordId` is bound to the form's record context, not a static value

### Control not updating after a new push

- Hard refresh the browser (`Ctrl+Shift+R`) — cached assets may be serving the old version
- Clear browser cache if hard refresh does not resolve it
- Confirm `pac pcf push` completed without errors before refreshing

### `pac pcf push` fails with "No publisher found"

- Your publisher prefix does not match any publisher registered in the target environment
- Go to **Solutions → Publishers** in Maker Portal and confirm the prefix
- Re-run with the exact prefix shown there

### Managed solution import fails in test/production

- Check if an older version of the same solution is already installed
- Unmanaged solutions must be deleted before importing a managed version of the same solution
- Confirm the solution version number was incremented before export
```

**Step 2: Verify in VS Code preview**

Confirm all four new `###` entries render as sub-headings under the Troubleshooting section.

**Step 3: Commit**

```bash
git add docs/powerapps-environment-install.md
git commit -m "docs: expand troubleshooting section with four new entries"
```

---

### Task 8: Replace single Quick Start with dual Developer and Admin quick-start blocks

**Files:**
- Modify: `docs/powerapps-environment-install.md` (Quick Start section at bottom)

**Step 1: Replace the existing Quick Start section entirely**

Replace everything from `## Quick Start (copy/paste exact sequence)` to the end of the file with:

```markdown
---

## Quick Start — Developer (copy/paste exact sequence)

Run this from repo root in PowerShell:

```powershell
node -v
npm -v
pac help
npm run build
pac auth create --url "https://<your-org>.crm.dynamics.com"
pac auth list
pac pcf push --publisher-prefix <yourPrefix>
```

Then in Maker Portal:

1. Add control to form
2. Bind `recordId` and `entityName` to the record context
3. Save + Publish

---

## Quick Start — Admin (production deployment via managed solution)

You will need a `.zip` managed solution file exported by a developer.

In Maker Portal:

1. Go to [make.powerapps.com](https://make.powerapps.com) and select the target environment
2. Go to **Solutions** → **Import solution**
3. Upload the `.zip` managed solution file
4. Follow the import wizard — accept defaults unless instructed otherwise
5. After import completes, go to the target table's form
6. Add the PCF control as a component
7. Bind `recordId` and `entityName` to the record context
8. Save + Publish
9. Open a record and confirm the control loads correctly
```

**Step 2: Verify in VS Code preview**

Confirm both quick-start blocks render with correct headings, code blocks, and numbered lists.

**Step 3: Commit**

```bash
git add docs/powerapps-environment-install.md
git commit -m "docs: replace single quick start with developer and admin quick start blocks"
```

---

## Completion

After all tasks are committed, the install guide will:
- Orient each audience immediately at the top
- Explain how to find the environment URL and publisher prefix in context
- Explain what the control inputs do so admins can bind them correctly
- Give developers a harness testing path before pushing
- Cover the most common failure modes for both roles
- Provide a dedicated quick-start block for each audience
