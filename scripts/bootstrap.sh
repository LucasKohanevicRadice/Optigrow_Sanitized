#!/usr/bin/env bash
set -euo pipefail
command -v node >/dev/null 2>&1 || { echo "Node.js required. Install from https://nodejs.org/"; exit 1; }

repoRoot="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$repoRoot" || exit 1

echo "Configuring tracked hooksPath -> .githooks (local config)"
git config core.hooksPath .githooks

# ensure POSIX wrapper exists and is LF-normalized
if [ -f .githooks/pre-commit ]; then
  awk 'NR==1{sub(/^\xef\xbb\xbf/,"")}{print}' .githooks/pre-commit | sed $'s/\r$//' > /tmp/pre-commit.tmp
  mv /tmp/pre-commit.tmp .githooks/pre-commit
  chmod +x .githooks/pre-commit
  git update-index --add --chmod=+x .githooks/pre-commit || true
  echo "Normalized .githooks/pre-commit and recorded exec bit"
fi

# ensure Windows wrapper exists (harmless on *nix)
if [ ! -f .githooks/pre-commit.cmd ]; then
  cat > .githooks/pre-commit.cmd <<'CMD'
@echo off
pushd "%~dp0\.."
node "%~dp0..\scripts\copilot-precommit-runner.js" --interactive %*
popd
exit /b %ERRORLEVEL%
CMD
  echo "Wrote .githooks/pre-commit.cmd"
fi

echo "Running local generators (outputs remain local and ignored by default)..."
node ./scripts/generate-manifest.js || true
node ./scripts/generate-copilot-readme.js || true
node ./scripts/generate-root-readme.js || true

echo "Bootstrap complete. Generated files live locally (.copilot-manifest.json and .copilot/)."
echo "IMPORTANT: .copilot and .copilot-manifest.json are ignored by default. Do NOT commit them unless you intentionally create a sanitized snapshot."
