Param()
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js not found. Install Node.js first: https://nodejs.org/"
  exit 1
}

$repoRoot = (git rev-parse --show-toplevel) 2>$null
if (-not $repoRoot) { $repoRoot = Get-Location }
Set-Location $repoRoot

Write-Host "Configuring tracked hooksPath -> .githooks (local config)"
git config core.hooksPath .githooks

# ensure windows wrapper exists
$cmdPath = Join-Path $repoRoot '.githooks\pre-commit.cmd'
if (-not (Test-Path $cmdPath)) {
  Set-Content $cmdPath -Value '@echo off
pushd "%~dp0\.."
node "%~dp0..\scripts\copilot-precommit-runner.js" --interactive %*
popd
exit /b %ERRORLEVEL%' -NoNewline
  Write-Host "Wrote .githooks\pre-commit.cmd"
}

# normalize POSIX hook (if present)
$shPath = Join-Path $repoRoot '.githooks\pre-commit'
if (Test-Path $shPath) {
  $s = Get-Content $shPath -Raw
  if ($s.Length -gt 0 -and $s[0] -eq [char]0xFEFF) { $s = $s.Substring(1) }
  $s -replace "`r`n", "`n" | Set-Content $shPath -NoNewline
  Write-Host "Normalized .githooks/pre-commit line endings"
  # Record exec bit in index; ignore errors if any
  git update-index --add --chmod=+x .githooks/pre-commit 2>$null
  Write-Host "Recorded exec bit (index)"
}

Write-Host "Running local generators (outputs stay local and ignored by default)..."
node .\scripts\generate-manifest.js
node .\scripts\generate-copilot-readme.js
node .\scripts\generate-root-readme.js

Write-Host "Bootstrap complete. Generated files live locally (.copilot-manifest.json and .copilot/)."
Write-Host "IMPORTANT: .copilot and .copilot-manifest.json are ignored by default. Do NOT commit them unless you intentionally create a sanitized snapshot."
