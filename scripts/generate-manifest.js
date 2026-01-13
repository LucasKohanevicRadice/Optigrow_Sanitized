#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function gitLsFiles() {
  try {
    // use null-separated list to be safer with whitespace
    const out = execSync("git ls-files -z", { encoding: "utf8" });
    return out.split("\0").filter(Boolean);
  } catch (e) {
    return [];
  }
}

function readPackageJson(root) {
  const p = path.join(root, "package.json");
  if (fs.existsSync(p)) {
    try {
      const json = JSON.parse(fs.readFileSync(p, "utf8"));
      return {
        name: json.name,
        version: json.version,
        dependencies: json.dependencies || {},
        devDependencies: json.devDependencies || {},
      };
    } catch (e) {
      return null;
    }
  }
  return null;
}

function previewEnvFile(fullPath) {
  try {
    const content = fs
      .readFileSync(fullPath, "utf8")
      .split(/\r?\n/)
      .slice(0, 50);
    return content
      .map((l) =>
        l.replace(/^\s*([^#=\s]+?)=(.*)$/, (_, k) => `${k}=<REDACTED>`)
      )
      .join("\n");
  } catch (e) {
    return null;
  }
}

function findEnvFiles(files, root) {
  const envs = files.filter((f) => path.basename(f).startsWith(".env"));
  return envs
    .slice(0, 20)
    .map((fp) => ({ path: fp, preview: previewEnvFile(path.join(root, fp)) }));
}

function buildManifest() {
  const root = process.cwd();
  const files = gitLsFiles();
  const packageRoot = readPackageJson(root);
  const envFiles = findEnvFiles(files, root);

  return {
    generatedAt: new Date().toISOString(),
    repoRoot: root,
    filesCount: files.length,
    files: files.slice(0, 500),
    packageRoot,
    envFiles,
  };
}

function writeManifest(manifest) {
  const outPath = path.join(process.cwd(), ".copilot-manifest.json");
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2), "utf8");
}

function writeSanitizedSnapshot(manifest) {
  const safe = {
    repoRoot: manifest.repoRoot,
    filesCount: manifest.filesCount,
    files: manifest.files,
    packageRoot: manifest.packageRoot || null,
  };
  const outDir = path.join(process.cwd(), ".copilot");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "manifest.sanitized.json");
  fs.writeFileSync(outPath, JSON.stringify(safe, null, 2), "utf8");
  console.log("Wrote .copilot/manifest.sanitized.json");
}

try {
  const manifest = buildManifest();
  writeManifest(manifest);
  console.log("Wrote .copilot-manifest.json");
  if (
    process.argv.includes("--sanitized") ||
    process.argv.includes("--publish")
  ) {
    writeSanitizedSnapshot(manifest);
  }
  process.exit(0);
} catch (e) {
  console.error("Failed to write manifest:", e && e.message ? e.message : e);
  process.exit(1);
}
