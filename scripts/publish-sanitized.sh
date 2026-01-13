#!/usr/bin/env bash
set -euo pipefail
repoRoot="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$repoRoot" || exit 1

san=".copilot/manifest.sanitized.json"
if [ ! -f "$san" ]; then
  echo "Sanitized manifest not found. Generating..."
  node ./scripts/generate-manifest.js --sanitized
fi

mkdir -p docs
mv -f "$san" docs/manifest.sanitized.json
echo "Moved sanitized manifest to docs/manifest.sanitized.json"

${EDITOR:-vi} docs/manifest.sanitized.json
echo "Review the file, then run: git add docs/manifest.sanitized.json && git commit -m 'docs: add sanitized manifest snapshot'"
