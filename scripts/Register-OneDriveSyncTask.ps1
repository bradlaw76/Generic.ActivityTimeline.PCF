param(
    [string]$TaskName = "GenericActivityTimeline-OneDriveSync",
    [int]$IntervalMinutes = 30,
    [switch]$Mirror
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if ($IntervalMinutes -lt 5) {
    throw "IntervalMinutes must be 5 or greater."
}

$syncScript = Join-Path $PSScriptRoot "Sync-OneDrive.ps1"
if (-not (Test-Path -LiteralPath $syncScript)) {
    throw "Sync script not found: $syncScript"
}

$mirrorArg = if ($Mirror) { " -Mirror" } else { "" }
$taskCommand = "`"powershell.exe`" -NoProfile -ExecutionPolicy Bypass -File `"$syncScript`"$mirrorArg"

Write-Host "Registering scheduled task '$TaskName' every $IntervalMinutes minutes..."
& schtasks.exe /Create /F /SC MINUTE /MO $IntervalMinutes /TN $TaskName /TR $taskCommand
if ($LASTEXITCODE -ne 0) {
    throw "Failed to register scheduled task (exit code $LASTEXITCODE)."
}

Write-Host "Scheduled task created."
Write-Host "Run now with: schtasks /Run /TN `"$TaskName`""
Write-Host "Delete with:  schtasks /Delete /TN `"$TaskName`" /F"
