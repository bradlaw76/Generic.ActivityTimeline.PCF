param(
    [string]$SourcePath = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
    [string]$TargetPath = "D:\Onedrive\OneDrive - Microsoft - Nov 24\OneDrive - Microsoft\DEMO\My Github\Generic.AppointmentScheduling",
    [string]$BackupPath,
    [switch]$Mirror,
    [switch]$NoBundleBackup,
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $SourcePath)) {
    throw "Source path not found: $SourcePath"
}

if (-not (Test-Path -LiteralPath $TargetPath)) {
    New-Item -ItemType Directory -Path $TargetPath -Force | Out-Null
}

if (-not $BackupPath) {
    $BackupPath = Join-Path $TargetPath "_git-backups"
}

if (-not (Test-Path -LiteralPath $BackupPath)) {
    New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
}

Write-Host "Source: $SourcePath"
Write-Host "Target: $TargetPath"
Write-Host "Backup: $BackupPath"

$excludeDirs = @(
    "node_modules",
    "out",
    "coverage",
    ".git",
    ".next",
    "dist",
    "build"
)

$robocopyArgs = @(
    $SourcePath,
    $TargetPath
)

if ($Mirror) {
    $robocopyArgs += "/MIR"
} else {
    $robocopyArgs += "/E"
}

$robocopyArgs += @(
    "/R:2",
    "/W:2",
    "/Z",
    "/FFT",
    "/NP",
    "/NFL",
    "/NDL",
    "/XD"
)
$robocopyArgs += $excludeDirs

if ($WhatIf) {
    $robocopyArgs += "/L"
}

Write-Host "Running robocopy sync..."
& robocopy @robocopyArgs
$robocopyExitCode = $LASTEXITCODE

if ($robocopyExitCode -gt 7) {
    throw "Robocopy failed with exit code $robocopyExitCode"
}

Write-Host "Sync complete (robocopy exit code: $robocopyExitCode)."

if (-not $NoBundleBackup) {
    $gitDir = Join-Path $SourcePath ".git"
    if (Test-Path -LiteralPath $gitDir) {
        $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
        $repoName = Split-Path $SourcePath -Leaf
        $bundleFile = Join-Path $BackupPath "$repoName-$timestamp.bundle"

        Write-Host "Creating git bundle backup..."
        & git -C $SourcePath bundle create $bundleFile --all
        if ($LASTEXITCODE -ne 0) {
            throw "git bundle create failed with exit code $LASTEXITCODE"
        }

        Write-Host "Backup created: $bundleFile"
    } else {
        Write-Warning "No .git folder found at source; skipped git bundle backup."
    }
}

Write-Host "Done."
