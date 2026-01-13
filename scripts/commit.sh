#!/bin/sh
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo .)"
cd "$REPO_ROOT" || exit 0
NODE_PATH="$(command -v node 2>/dev/null || echo node)"
exec "$NODE_PATH" "$REPO_ROOT/scripts/commit.js" "$@"
