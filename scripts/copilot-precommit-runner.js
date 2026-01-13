#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");

function spawnPromise(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, Object.assign({ stdio: "inherit" }, opts));
    p.on("error", (e) => reject(e));
    p.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`))
    );
  });
}

function startSpinner(msg) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  process.stdout.write(msg + " ");
  const id = setInterval(() => {
    process.stdout.write("\b" + frames[(i = (i + 1) % frames.length)]);
  }, 80);
  return () => {
    clearInterval(id);
    process.stdout.write("\b"); // clear spinner char
    process.stdout.write(" \n");
  };
}

async function runGenerators(useStaged) {
  const argsFlag = useStaged ? ["--staged"] : [];
  const stopSpinner = startSpinner("Running Copilot generators");
  // Resolve generator scripts relative to this file so the runner works
  // when executed from any working directory.
  const scriptDir = path.dirname(__filename);
  try {
    await spawnPromise(process.execPath, [
      path.join(scriptDir, "generate-manifest.js"),
      ...argsFlag,
    ]);
    await spawnPromise(process.execPath, [
      path.join(scriptDir, "generate-copilot-readme.js"),
      ...argsFlag,
    ]);
    await spawnPromise(process.execPath, [
      path.join(scriptDir, "generate-root-readme.js"),
      ...argsFlag,
    ]);
    stopSpinner();
    console.log("Copilot generators completed successfully.");
    return 0;
  } catch (err) {
    stopSpinner();
    console.error(
      "Error running generators:",
      err && err.message ? err.message : err
    );
    return 1;
  }
}

const { execSync } = require("child_process");

function stagedFiles() {
  try {
    const out = execSync("git diff --name-only --cached", { encoding: "utf8" });
    return out
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  } catch (e) {
    return [];
  }
}

function promptYesNo(question) {
  return new Promise((resolve) => {
    process.stdout.write(question + " ");
    process.stdin.setEncoding("utf8");
    process.stdin.resume();
    process.stdin.once("data", (data) => {
      const answer = data.toString().trim();
      process.stdin.pause();
      resolve(/^y(es)?$/i.test(answer));
    });
  });
}

async function main() {
  const interactive = process.argv.includes("--interactive");
  const useStaged = process.argv.includes("--staged") || interactive;

  if (interactive) {
    const staged = stagedFiles();
    if (!staged.length) {
      console.log("No staged files.");
      return 0;
    }
    console.log("Staged files:");
    staged.forEach((f) => console.log("  " + f));
    const auto = process.env.COPILOT_PRECOMMIT_AUTO === "1";
    let doGen = auto;
    if (!auto) {
      const ok = await promptYesNo(
        "Generate/patch README/manifest for staged files and include in this commit? [y/N]:"
      );
      doGen = ok;
    }
    if (!doGen) return 0;
  }

  const code = await runGenerators(useStaged);
  if (code === 0 && useStaged) {
    try {
      execSync("git add README.md .copilot-manifest.json .copilot/README.md");
    } catch (e) {
      /* ignore */
    }
  }
  return code;
}

(async () => {
  const exitCode = await main();
  process.exit(exitCode);
})();
