# pre-commit hook — OptiGrow

Purpose
- Interactive pre-commit that offers to generate/patch README.md and .copilot-manifest.json for staged files.
- Runs scripts/copilot-precommit-runner.js which runs the manifest + README generators.

How it runs
- On Windows Git will execute .githooks/pre-commit.cmd (recommended).
- On Unix-like systems the shell script .githooks/pre-commit.sh can be used.

Interactive behavior
- If run in a TTY, the runner prompts: "Generate/patch README/manifest for staged files and include in this commit? [y/N]".
- Set environment variable COPILOT_PRECOMMIT_AUTO=1 to auto-accept in non-interactive/GUI flows.

Files affected
- README.md (patched/updated)
- .copilot/README.md and .copilot-manifest.json (generated; these are ignored by default)

Safety & workflow notes
- By default .copilot/ and .copilot-manifest.json are in .gitignore to avoid leaking env previews.
- If you want the hook local-only, add `.githooks/pre-commit` to .gitignore and do not commit it.
- To include generated files in the same commit the hook re-stages them; on Windows the wrapper re-stages README.md; force-adding ignored files is optional and requires consent.