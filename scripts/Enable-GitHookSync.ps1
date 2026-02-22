Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$hooksPath = ".githooks"

if (-not (Test-Path -LiteralPath (Join-Path $repoRoot ".git"))) {
    throw "No .git folder found at $repoRoot"
}

if (-not (Test-Path -LiteralPath (Join-Path $repoRoot ".githooks\pre-push"))) {
    throw "Hook file missing: $repoRoot\.githooks\pre-push"
}

Write-Host "Configuring git hooks path..."
& git -C $repoRoot config core.hooksPath $hooksPath
if ($LASTEXITCODE -ne 0) {
    throw "Failed to set core.hooksPath"
}

Write-Host "Enabled pre-push OneDrive sync hook."
Write-Host "Verify with: git -C `"$repoRoot`" config --get core.hooksPath"
Write-Host "Disable with: git -C `"$repoRoot`" config --unset core.hooksPath"
