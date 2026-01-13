# Normalize hooks, set exec bit, unstage staged deletion, and add wrapper files
$ErrorActionPreference = 'Stop'

$repoRoot = (git rev-parse --show-toplevel) -replace "\\$",""
Set-Location $repoRoot

$hook = '.githooks\pre-commit'
if (Test-Path $hook) {
  $s = Get-Content $hook -Raw
  if ($s.Length -gt 0 -and $s[0] -eq [char]0xFEFF) { $s = $s.Substring(1) }
  $s = $s -replace "`r`n", "`n"
  Set-Content -Path $hook -Value $s -NoNewline
  Write-Host "normalized $hook"
} else {
  Write-Host "$hook not found"
}

$cmd = '.githooks\pre-commit.cmd'
if (Test-Path $cmd) {
  $c = Get-Content $cmd -Raw
  $c = $c -replace "`r?`n", "`r`n"
  Set-Content -Path $cmd -Value $c -NoNewline
  Write-Host "normalized $cmd"
} else {
  Write-Host "$cmd not found"
}

# record exec bit for shell hook in index (Windows records exec bit in index)
Write-Host "setting exec bit in index for $hook"
git update-index --add --chmod=+x .githooks/pre-commit

# unstage any accidental staged deletion of the hook
try {
  git restore --staged .githooks/pre-commit 2>$null
  Write-Host "unstaged any staged deletion of .githooks/pre-commit (if present)"
} catch {
  Write-Host "no staged deletion to unstage"
}

# add both wrappers to index
git add .githooks/pre-commit .githooks/pre-commit.cmd

Write-Host "staged wrappers"

git status --porcelain | ForEach-Object { Write-Host $_ }

Write-Host "done"
