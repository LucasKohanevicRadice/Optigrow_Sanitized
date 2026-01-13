#!/usr/bin/env node
const { spawnSync } = require("child_process");
const res = spawnSync(
  process.execPath,
  [require("path").join(__dirname, "generate-manifest.js"), "--sanitized"],
  { stdio: "inherit" }
);
process.exit(res.status || 0);
