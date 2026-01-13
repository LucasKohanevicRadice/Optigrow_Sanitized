#!/usr/bin/env node
const { spawnSync } = require("child_process");
const path = require("path");

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, Object.assign({ stdio: "inherit" }, opts));
  return res.status || 0;
}

async function main() {
  const argv = process.argv.slice(2);
  const skipIndex = argv.indexOf("--skip-commit");
  const skipCommit = skipIndex !== -1;
  if (skipCommit) argv.splice(skipIndex, 1);

  // Resolve runner relative to this script file (works when called from subfolders)
  const scriptDir = path.dirname(__filename);
  const runner = path.join(scriptDir, "copilot-precommit-runner.js");

  // Run interactive runner first
  const nodeExec = process.execPath;
  const runnerArgs = [runner, "--interactive"];
  const code = run(nodeExec, runnerArgs);
  if (code !== 0) {
    process.exit(code);
  }

  if (skipCommit) {
    console.log(
      "Runner succeeded; --skip-commit given so not running git commit."
    );
    process.exit(0);
  }

  // Run git commit with any remaining args
  // Forward remaining args to git commit. If user passed '--', npm will strip it;
  // when running directly with node the caller can pass args after '--'.
  const commitArgs = ["commit", "--no-verify", ...argv];
  const gitCode = run("git", commitArgs);
  process.exit(gitCode);
}

main();
