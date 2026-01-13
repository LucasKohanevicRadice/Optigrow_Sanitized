
#!/bin/sh
# Invoke Node-based precommit runner which handles interactive prompting
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo .)"
cd "$REPO_ROOT" || exit 0

if command -v node >/dev/null 2>&1; then
  node ./scripts/copilot-precommit-runner.js --interactive || exit $?
fi

exit 0
