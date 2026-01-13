Param()
$repoRoot = Get-Location
Write-Host "Configuring repository to use tracked .githooks directory..."
git config core.hooksPath .githooks
if (Test-Path -Path ".githooks/post-commit") {
  # Try to mark executable in index (Git for Windows supports this)
  try { git update-index --add --chmod=+x .githooks/post-commit } catch { }
}
Write-Host "Configured core.hooksPath to .githooks. Run a test commit to verify manifest update."
