Param(
  [Parameter(ValueFromRemainingArguments=$true)]
  $Args
)

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Error "Node.js not found. Install Node.js first: https://nodejs.org/"
  exit 1
}

$repoRoot = (git rev-parse --show-toplevel) 2>$null
if (-not $repoRoot) { $repoRoot = Get-Location }
Set-Location $repoRoot

$node = (Get-Command node).Source
$script = Join-Path $repoRoot 'scripts\\commit.js'
& $node $script @Args
exit $LASTEXITCODE
