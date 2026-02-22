# Generic Activity Timeline PCF

Power Apps Component Framework (PCF) control for rendering an activity timeline in a model-driven app.

---

## 1) What this guide gives you

This is a **first-time setup guide** for Windows. If you have never deployed a PCF control before, follow this in order:

1. Install required tools
2. Run the control locally in the PCF test harness
3. Push it to a Dataverse environment
4. Add it to a form in Power Apps

For a focused deployment walkthrough, see [docs/powerapps-environment-install.md](docs/powerapps-environment-install.md).

---

## 2) Prerequisites

You need:

- Windows 10/11
- Admin rights on your machine (recommended for installs)
- A Power Platform environment URL (example: `https://contoso.crm.dynamics.com`)
- Permission to customize tables/forms in that environment

---

## 3) Install required tools (first time)

### 3.1 Install Node.js LTS (required)

PCF build tools use Node. This project is working with Node 20.x.

**Option A (recommended): winget**

```powershell
winget install OpenJS.NodeJS.LTS
```

Verify:

```powershell
node -v
npm -v
```

Expected: Node 20+ and npm available.

---

### 3.2 Install Power Platform CLI (`pac`) (required)

You need `pac` for authentication and deployment.

**Option A (recommended): winget**

```powershell
winget install Microsoft.PowerPlatformCLI
```

Then open a **new** terminal and verify:

```powershell
pac help
```

---

### 3.3 (Optional) Install Git

If not already installed:

```powershell
winget install Git.Git
```

---

## 4) Get the project and install dependencies

From a terminal:

```powershell
cd C:\pcf
# if needed:
# git clone <your-repo-url>
cd .\Generic.ActivityTimeline.PCF
npm install
```

---

## 5) Build and run locally (PCF test harness)

### 5.1 Build once

```powershell
npm run build
```

### 5.2 Run local harness

```powershell
npm start
```

When successful, you will see:

- Local URL like `http://localhost:8182`
- A right-side panel for test input properties (`recordId`, `entityName`)

> If `recordId`/`entityName` are empty, an empty timeline/demo-like view is expected.

---

## 6) Run tests

```powershell
npm test
```

Current project tests are Jest-based utility tests.

---

## 7) Deploy to your Dataverse environment (first deployment)

### 7.1 Authenticate

```powershell
pac auth create --url "https://<your-org>.crm.dynamics.com"
pac auth list
```

If you have multiple profiles, select one:

```powershell
pac auth select --index 1
```

---

### 7.2 Push the PCF control to Dataverse

Use a publisher prefix from your solution publisher (for example `contoso`).

```powershell
pac pcf push --publisher-prefix <yourPrefix>
```

Example:

```powershell
pac pcf push --publisher-prefix contoso
```

Notes:

- This is best for development/test environments.
- For production, use managed solution packaging/release process.

---

## 8) Add the control to a model-driven app form

1. Open Power Apps Maker Portal.
2. Go to your table and open the target form.
3. Select a field/subgrid where this control should be attached.
4. Choose **Components** / **Add control** and select this PCF control.
5. Bind input properties:
   - `recordId`
   - `entityName`
6. Save and publish customizations.
7. Open a record and verify the control renders.

---

## 9) Common commands

```powershell
npm install        # install dependencies
npm run build      # build control
npm start          # run local harness
npm test           # run unit tests
pac auth list      # show Dataverse auth profiles
pac pcf push --publisher-prefix <prefix>  # deploy to environment
```

---

## 10) Troubleshooting

### `Cannot find module ... pcf-start/bin/pcf-start.js`

Run:

```powershell
npm install
```

This project requires `pcf-start` in dev dependencies.

### `pac` command not found

- Reopen terminal/VS Code after install
- Confirm install with `pac help`
- If still missing, reinstall Power Platform CLI

### `npm start` fails because port is in use

- Stop other local harness/server processes
- Re-run `npm start`

### Auth/deploy fails with permissions

- Confirm you are targeting the correct environment URL
- Confirm your account has customization rights
- Verify selected auth profile: `pac auth list`

---

## 11) Recommended next step (production readiness)

For team/prod rollout:

- Package into a Dataverse solution
- Use environment-specific deployment pipeline
- Promote as managed solution in higher environments

---

## 12) Automate sync + backup to OneDrive

This repo now includes automation scripts in [scripts/Sync-OneDrive.ps1](scripts/Sync-OneDrive.ps1) and [scripts/Register-OneDriveSyncTask.ps1](scripts/Register-OneDriveSyncTask.ps1).

### 12.1 One-time sync (safe default)

From repo root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Sync-OneDrive.ps1
```

Default target path is preconfigured to:

`D:\Onedrive\OneDrive - Microsoft - Nov 24\OneDrive - Microsoft\DEMO\My Github\Generic.AppointmentScheduling`

What this does:

- Syncs source code to the OneDrive location
- Excludes heavy/generated folders (`node_modules`, `out`, `dist`, `build`, `coverage`, `.git`)
- Creates a Git bundle backup under `<Target>\_git-backups`

### 12.2 Dry-run before first real sync

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Sync-OneDrive.ps1 -WhatIf
```

### 12.3 Mirror mode (advanced)

Mirror mode makes destination match source exactly (including deletions):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Sync-OneDrive.ps1 -Mirror
```

Use this only if you want strict one-way mirroring.

### 12.4 Register scheduled automation

Create a Windows Scheduled Task that runs every 30 minutes:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Register-OneDriveSyncTask.ps1 -IntervalMinutes 30
```

Optional strict mirror scheduler:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Register-OneDriveSyncTask.ps1 -IntervalMinutes 30 -Mirror
```

Run task now:

```powershell
schtasks /Run /TN "GenericActivityTimeline-OneDriveSync"
```

Delete task:

```powershell
schtasks /Delete /TN "GenericActivityTimeline-OneDriveSync" /F
```

### 12.5 Git-only mode (recommended if you do not want scheduling)

If you want sync to run **only when you push updates to Git**, enable the `pre-push` hook:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Enable-GitHookSync.ps1
```

What this does:

- Configures `core.hooksPath` to `.githooks`
- Runs OneDrive sync before each `git push`
- Creates a Git bundle backup under `<Target>\_git-backups` on each push
- Aborts push if sync fails (so Git + OneDrive stay aligned)

Verify:

```powershell
git config --get core.hooksPath
```

Disable hook mode:

```powershell
git config --unset core.hooksPath
```
