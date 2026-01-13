Param()
$repoRoot = (git rev-parse --show-toplevel) 2>$null
if (-not $repoRoot) { $repoRoot = Get-Location }
Set-Location $repoRoot

$san = Join-Path $repoRoot '.copilot\manifest.sanitized.json'
if (-not (Test-Path $san)) {
  Write-Host "Sanitized manifest not found. Generating..."
  node .\scripts\generate-manifest.js --sanitized
}

$destDir = Join-Path $repoRoot 'docs'
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir | Out-Null }

$dest = Join-Path $destDir 'manifest.sanitized.json'
Move-Item -Force $san $dest
Write-Host "Moved sanitized manifest to $dest"

Start-Process notepad -ArgumentList $dest -Wait
Write-Host "Review the file, then run: git add $dest; git commit -m 'docs: add sanitized manifest snapshot'"
